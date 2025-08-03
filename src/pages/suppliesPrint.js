import React from "react";
import qrMain from "../QR code.png"; // ضع صورة QR الرئيسية
import logo from "../logo.jfif"; // ضع اللوجو هنا
import qrApp from "../QR code.png"; // QR تحميل التطبيق
import qrTrack from "../QR code.png"; // QR تتبع الرحلة
import qrGuide from "../QR code.png"; // QR دليل المعتمر

export default function ArabicInvoice() {
  return (
    <div
      className="print-container  max-w-6xl mx-auto bg-white font-sans border border-gray-300"
      dir="rtl"
    >
      <button
        onClick={() => window.print()}
        className="no-print fixed  bottom-4 left-42 bg-blue-500 text-white px-4 py-2 rounded"
      >
        طباعة الفاتورة
      </button>
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-300">
        {/*  Logo Left */}
        <img src={logo} alt="Logo" className="w-24 h-24" />

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl  text-[#0673cc]">فاتوره ضريبيه</h1>
          <p className="text-[#0673cc] font-semibold">Invoice tax</p>
        </div>

        {/* QR Code Right */}
        <img src={qrMain} alt="QR" className="w-24 h-24" />
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-5 gap-0">
        {/* Right 2/3 */}

        <div className="p-4   space-y-4 text-xs bg-[#f0f0f2] text-center flex flex-col justify-between">
          {/* Trip Details */}
          <div>
            <h2 className="font-bold mb-1">تفاصيل الرحلة</h2>
            <h3 className="text-gray-600 mb-2">Trip Details</h3>
            <p className="mb-2">
              رحلة ٤ يوم مكة والمدينة يوم الاحد
              <br />
              - التحرك من المكتب ٣ العصر الأحد
              <br />
              - الوصول مكة صباح الإثنين
              <br />
              - التحرك للمدينة مساء الثلاثاء
              <br />- العودة للدمام الخميس فجراً
            </p>
          </div>

          {/* Traveler Data Label */}
          <div>
            <h2 className="font-bold mb-1">بيانات المسافرين</h2>
            <h3 className="text-gray-600 mb-2">Traveler data</h3>
          </div>

          {/* QR Codes */}
          <div className="grid grid-cols-2 gap-2">
            {[qrApp, qrTrack, qrGuide, qrApp].map((qr, i) => (
              <img key={i} src={qr} alt="QR" className="w- 16 h-16 mx-auto" />
            ))}
          </div>

          {/* Important Info */}
          <div className="text-right">
            <h2 className="font-bold ">معلومات عامة</h2>
            <h3 className="text-gray-600 mb-1">Important Info</h3>
            <p>١- ليك فرصة استرداد المبلغ قبل ٣٠ ساعة</p>
            <p>٢- الحضور قبل الموعد بـ٣٠ دقيقة وإلا المكتب غير مسؤول</p>
          </div>
        </div>
        {/* Left 1/3 */}

        <div className="col-span-4 p-4 border-l border-gray-300 ">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p>اسم العميل / Customer name: ...................</p>
              <p className="flex flex-nowrap">
                رقم الجوال / Phone number: ...................
              </p>
              <p>الهويه / Customer ID: ...................</p>
            </div>
            <div className="text-left">
              <p className=" flex-nowrap text-end">
                رقم الفاتورة / Invoice number: ................
              </p>
              <p>التاريخ / Date: ....................</p>
              <p>المسؤول / Admin: .....................</p>
            </div>
          </div>

          {/* Programs with Checkboxes */}
          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="space-y-1">
              <label className="flex items-center rounded-full gap-2">
                <input
                  type="checkbox"
                  className="accent-[#0673cc] rounded-full"
                />
                برنامج ٣ يوم مكه والمدينه
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#0673cc]" /> برنامج ٤
                يوم مكه والمدينه
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#0673cc]" /> برنامج ٣
                يوم مكه فقط
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#0673cc]" /> برنامج
                ذهاب مكه فقط
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#0673cc]" /> برنامج
                رجوع إلى الدمام فقط
              </label>
            </div>
            <div className="space-y-1 text-left">
              <p>3Day Makkah & Madinah Itinerary</p>
              <p>4Day Makkah & Madinah Itinerary</p>
              <p>3Day Makkah Itinerary Only</p>
              <p>One-Way Trip to Makkah Only</p>
              <p>Return Trip to Dammam Only</p>
            </div>
          </div>

          {/* Seat & Member Row */}
          <div className="w-full mb-4 border border-gray-300 rounded-xl p-2 bg-gray-50">
            <div className="grid grid-cols-5 gap-2 text-center text-xs mb-2">
              <div>
                <label className="flex justify-between  mb-1">
                  رقم الباص <span>.Bus No</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-1 text-center"
                />
              </div>
              <div>
                <label className="flex justify-between  mb-1">
                  رقم المقعد<span> .Seat No</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-1 text-center"
                />
              </div>
              <div>
                <label className="flex justify-between  mb-1">
                  سرير<span> . Bed</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-1 text-center"
                />
              </div>

              <div>
                <label className="flex justify-between  mb-1">
                  غرفة<span> . Room</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-1 text-center"
                />
              </div>
              <div>
                <label className="flex justify-between  mb-1">
                  عضو<span> . Member</span>
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md p-1 text-center"
                />
              </div>
            </div>

            {/* Member Type */}
            <div className="flex justify-end gap-6 text-xs mt-1">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="memberType"
                  className="accent-[#0673cc]"
                />
                أعزب - Single
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="memberType"
                  className="accent-[#0673cc]"
                />
                عائلة - Family
              </label>
            </div>
          </div>

          {/* Traveler Data */}
          <div className="mb-4">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-2 text-xs border border-gray-300 border-b-0 last:border-b mb-1 p-1"
                >
                  <input
                    placeholder="الاسم / Name"
                    className="border p-1 text-xs"
                  />
                  <input
                    placeholder="رقم الاقامة / Residence number"
                    className="border p-1 text-xs"
                  />
                  <input
                    placeholder="الجنسية / Nationality"
                    className="border p-1 text-xs"
                  />
                </div>
              ))}
          </div>
          {/* Payment Table Wrapper */}
          <div className="border border-gray-300 rounded-2xl p-1 mb-6">
            {/* Services & Payment Method Section */}
            <div className="flex border border-gray-300 rounded-2xl p-1 gap-4 text-[10px] ">
              {/* Services Table Section */}
              <div className="w-1/2">
                <h3 className="font-bold  text-right">
                  خدمات والمستلزمات العمره
                </h3>

                <table className="w-full border border-gray-300 text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2">نوع الخدمة</th>
                      <th className="border border-gray-300 p-2">العدد</th>
                      <th className="border border-gray-300 p-2">السعر</th>
                      <th className="border border-gray-300 p-2">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["إحرامات", "أحذية", "شنط", "تكلفة الباص"].map(
                      (item, i) => (
                        <tr key={i}>
                          <td className="border border-gray-300 p-2">{item}</td>
                          <td className="border border-gray-300 p-2"></td>
                          <td className="border border-gray-300 p-2"></td>
                          <td className="border border-gray-300 p-2"></td>
                        </tr>
                      )
                    )}
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={3}
                        className="text-right border border-gray-300 p-2"
                      >
                        إجمالي المطلوب
                      </td>
                      <td className="border border-gray-300 p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Payment Method Section (Right-aligned for RTL) */}
              <div className="w-1/2 border-r flex flex-col justify-center items-start border-gray-300 pr-4">
                <h3 className="font-bold mb-2 text-right">طريقة الدفع:</h3>

                <div className="grid grid-cols-3 gap-2 text-right">
                  <label className="flex items-center justify-start gap-2">
                    <input type="radio" name="payment" />
                    كاش
                  </label>
                  <label className="flex items-center justify-start gap-2">
                    <input type="radio" name="payment" />
                    شبكة هلا
                  </label>
                  <label className="flex items-center justify-start gap-2">
                    <input type="radio" name="payment" />
                    شبكة الراجحي
                  </label>
                  <label className="flex items-center justify-start gap-2">
                    <input type="radio" name="payment" />
                    بنك هلا
                  </label>
                  <label className="flex items-center justify-start gap-2">
                    <input type="radio" name="payment" />
                    بنك الراجحي
                  </label>
                  <label className="flex items-center justify-start gap-2">
                    <input type="radio" name="payment" />
                    stc pay
                  </label>
                </div>

  <p className="mt-4 text-right font-bold">
                  طريقة دفع أخرى:
                  <span className="inline-block border-b border-dotted border-gray-500 w-32 ml-2 align-middle"></span>
                </p>
              </div>
            </div>

            {/* Totals Section */}
            <div className="grid grid-cols-3 gap-4 text-xs ">
              <div>
                <p className="mb-1 flex justify-between ">
                  الإجمالي قبل الضريبة:
                  <span className="text-gray-500">:Total before tax</span>
                </p>
                <input className="w-full border border-gray-300 rounded p-1" />
              </div>
              <div>
                <p className="mb-1 flex justify-between ">
                  قيمة الضريبة المضافة:
                  <span className="text-gray-500">:Value Added Tax</span>
                </p>
                <input className="w-full border border-gray-300 rounded p-1" />
              </div>
              <div>
                <p className="mb-1 flex justify-between ">
                  الإجمالي بعد الضريبة:
                  <span className="text-gray-500">:Total after tax</span>
                </p>
                <input className="w-full border border-gray-300 rounded p-1" />
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 text-xs mt-6">
              <div>
                <p>توقيع العميل:</p>
                <div className="border-t border-gray-400 mt-4 pt-1 text-gray-400 text-sm"></div>
              </div>

              <div>
                <p>مستلم المبلغ من العميل:</p>
                <div className="border-t border-gray-400 mt-4 pt-1 text-gray-400 text-sm"></div>
              </div>
              <div>
                <p>توقيع المدير :</p>
                <div className="border-t border-gray-400 mt-4 pt-1 text-gray-400 text-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-[#f0f0f2] text-end w-[100%] p-2 text-[10px]">
        📞 0580440207 / 0574746004 / 0583042015 / 0537772619 / 0549017406
        <p className="mt-1 text-[#0673cc] font-semibold">
          No Cancelation & No Refund, Confirm your Journey before 30 Hrs of
          Departure
        </p>
      </div> */}
    </div>
  );
}
