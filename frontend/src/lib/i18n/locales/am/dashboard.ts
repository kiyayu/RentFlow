export const dashboard = {
  title: "እንኳን ደህና መጡ፣ {{name}}",
  customerDescription: "የኪራይ መሣሪያዎችን ይመልከቱ እና ቀጣዩን ማስያዣዎን ያቅዱ።",
  staffDescription: "ኪራይን የሚያስኬዱ የመሣሪያ እና የማስያዣ ሥራዎችን ያስተዳድሩ።",
  addEquipment: "መሣሪያዎችን ያስተዳድሩ",
  browseEquipment: "መሣሪያዎችን ይመልከቱ",
  catalog: {
    title: "የመሣሪያ ዝርዝር",
    description: "በአሁኑ ጊዜ ለኪራይ የተዘረዘሩ ንቁ መሣሪያዎች።",
  },
  reservations: {
    title: "ማስያዣዎች",
    description: "የማስያዣ አስተዳደር የቦታ ማስያዣ ሥራዎች ሲጨመሩ እዚህ ይታያል።",
  },
  inventory: {
    title: "ክምችት",
    staffDescription: "ከክምችት የሥራ ቦታ እያንዳንዱን ዕቃ፣ ሁኔታ እና ተገኝነት ይከታተሉ።",
    customerDescription: "መሣሪያ እና ቀናት ሲመርጡ ተገኝነት ይረጋገጣል።",
  },
  metrics: {
    listed: "የተዘረዘሩ መሣሪያዎች",
    available: "የሚገኙ ዕቃዎች",
    attention: "ትኩረት የሚፈልጉ",
    pending: "ክፍያ በመጠባበቅ ላይ",
    confirmed: "የተረጋገጡ ማስያዣዎች",
  },
  operations: {
    title: "የሥራ አጠቃላይ ሁኔታ",
    description: "የክምችት ተገኝነት እና የቡድን ውሳኔ የሚፈልጉ ሁኔታዎች።",
    empty: "በአሁኑ ጊዜ የሥራ ችግር የለም።",
  },
  upcoming: { title: "ቀጣይ ኪራይ", empty: "ቀጣይ ኪራይ የለም። ለማስያዣ መሣሪያዎችን ይመልከቱ።" },
  nextStaff: {
    title: "የመሣሪያ ዝርዝሩን ያዘምኑ",
    description: "በመጀመሪያ የመሣሪያ ማቅረቢያዎችን ያክሉ፣ ከዚያም በክምችት ውስጥ እያንዳንዱን ዕቃ ያስተዳድሩ።",
  },
  nextCustomer: {
    title: "በሚያስፈልግዎት መሣሪያ ይጀምሩ",
    description: "የኪራይ ቀናትዎን ከመምረጥዎ በፊት የዕቃ ዝርዝሮችን እና የቀን ዋጋዎችን ይመልከቱ።",
  },
} as const;
