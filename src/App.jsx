import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Utensils, 
  BarChart3, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Upload, 
  Check, 
  X, 
  Camera, 
  ChevronRight, 
  FileText, 
  Moon, 
  Sun, 
  Info, 
  Sparkles,
  PieChart,
  Grid,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Map,
  TrendingUp,
  Tag
} from 'lucide-react';

// === CONSTANTS FOR CAMPLOG STATUS ===
const TRIP_STATUSES = {
  PLANNING: { label: 'กำลังวางแผน', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300', icon: 'Clock' },
  UPCOMING: { label: 'กำลังจะไป', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300', icon: 'Compass' },
  COMPLETED: { label: 'เสร็จสิ้นแล้ว', color: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300', icon: 'CheckCircle2' }
};

// === INITIAL DEMO DATA ===
const DEMO_TRIPS = [
  {
    id: 'trip-1',
    title: 'ทริปรับลมหนาว ดอยอินทนนท์',
    startDate: '2026-11-15',
    endDate: '2026-11-18',
    location: 'ลานกางเต็นท์ดงสน',
    province: 'เชียงใหม่',
    status: 'UPCOMING',
    coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    notes: 'สัมผัสทะเลหมอก อากาศประมาณ 10 องศา เตรียมเสื้อหนาวและถุงนอนหนาพิเศษไปแจมด้วย'
  },
  {
    id: 'trip-2',
    title: 'นอนฟังเสียงน้ำตก เจ็ดคด-โป่งก้อนเส้า',
    startDate: '2026-03-05',
    endDate: '2026-03-07',
    location: 'ริมอ่างเก็บน้ำซับป่าว่าน',
    province: 'สระบุรี',
    status: 'COMPLETED',
    coverImage: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=800&q=80',
    notes: 'ทริปใกล้กรุงเทพฯ เจอกระต่ายป่าเยอะมาก ลมพัดเย็นสบายเหมาะสำหรับพักผ่อนระยะสั้น'
  },
  {
    id: 'trip-3',
    title: 'ล่าทางช้างเผือก แก่งกระจาน',
    startDate: '2026-08-12',
    endDate: '2026-08-14',
    location: 'ลานพะเนินทุ่ง',
    province: 'เพชรบุรี',
    status: 'PLANNING',
    coverImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
    notes: 'แผนส่องทางช้างเผือกช่วงฟ้าเปิด อุปกรณ์กล้อง ขาตั้งไฟ และเสื้อกันลมพร้อมลุย'
  }
];

const DEMO_SHARED_EXPENSES = [
  {
    id: 'shared-1',
    title: 'ถังแก๊สแคมปิ้งและหัวเตาพกพา',
    category: 'อุปกรณ์',
    amount: 1450,
    date: '2026-03-01',
    notes: 'ซื้อใหม่ยกเซ็ต หารสามทริปตลอดยอดแชร์',
    tripIds: ['trip-1', 'trip-2', 'trip-3']
  },
  {
    id: 'shared-2',
    title: 'ค่าน้ำมันรถยนต์กระบะ 4WD (ไป-กลับ)',
    category: 'ค่าน้ำมัน',
    amount: 3200,
    date: '2026-03-05',
    notes: 'เติมดีเซลเต็มถัง ลุยดอยอินทนนท์',
    tripIds: ['trip-1']
  }
];

const DEMO_DIRECT_EXPENSES = [
  {
    id: 'direct-1',
    tripId: 'trip-1',
    title: 'ค่ากางเต็นท์อุทยานดงสน',
    type: 'calculated',
    peopleCount: 4,
    nightCount: 3,
    pricePerPersonNight: 100,
    amount: 1200,
    receiptImage: ''
  },
  {
    id: 'direct-2',
    tripId: 'trip-2',
    title: 'ค่าผ่านประตูและบำรุงสถานที่เจ็ดคด',
    type: 'flat',
    peopleCount: 2,
    nightCount: 2,
    pricePerPersonNight: 0,
    amount: 350,
    receiptImage: ''
  }
];

const DEMO_FOOD_ITEMS = [
  { id: 'food-1', title: 'เนื้อสไลด์สำหรับปิ้งย่างหมูกระทะ', quantity: 2, unitPrice: 280, completed: true, tripIds: ['trip-1', 'trip-2'] },
  { id: 'food-2', title: 'เซ็ตผักสดรวมและบะหมี่กึ่งสำเร็จรูป', quantity: 1, unitPrice: 150, completed: true, tripIds: ['trip-1', 'trip-2', 'trip-3'] },
  { id: 'food-3', title: 'น้ำดื่มและถังน้ำแข็ง', quantity: 3, unitPrice: 65, completed: false, tripIds: ['trip-1'] }
];

export default function App() {
  // === STATE ===
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Core Data Lists
  const [trips, setTrips] = useState([]);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [directExpenses, setDirectExpenses] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');

  // Form Modals UI States
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [tripForm, setTripForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    location: '',
    province: '',
    status: 'PLANNING',
    coverImage: '',
    notes: ''
  });

  const [showSharedModal, setShowSharedModal] = useState(false);
  const [editingSharedId, setEditingSharedId] = useState(null);
  const [sharedForm, setSharedForm] = useState({
    title: '',
    category: 'อุปกรณ์',
    amount: '',
    date: '',
    notes: '',
    tripIds: []
  });

  const [showDirectModal, setShowDirectModal] = useState(false);
  const [editingDirectId, setEditingDirectId] = useState(null);
  const [directForm, setDirectForm] = useState({
    tripId: '',
    title: '',
    type: 'calculated',
    peopleCount: 1,
    nightCount: 1,
    pricePerPersonNight: '',
    amount: '',
    receiptImage: ''
  });

  // อัปเดต State ให้รับค่า tripIds แบบ Array ได้
  const [foodForm, setFoodForm] = useState({ title: '', quantity: 1, unitPrice: '', tripIds: [] });
  const [editingFoodId, setEditingFoodId] = useState(null);

  // === LOCAL STORAGE SYNCRONIZATION ===
  useEffect(() => {
    const cachedTrips = localStorage.getItem('camplog_v2_trips');
    const cachedShared = localStorage.getItem('camplog_v2_shared');
    const cachedDirect = localStorage.getItem('camplog_v2_direct');
    const cachedFood = localStorage.getItem('camplog_v2_food');
    const cachedDark = localStorage.getItem('camplog_v2_dark');

    if (cachedTrips) setTrips(JSON.parse(cachedTrips));
    else setTrips(DEMO_TRIPS);

    if (cachedShared) setSharedExpenses(JSON.parse(cachedShared));
    else setSharedExpenses(DEMO_SHARED_EXPENSES);

    if (cachedDirect) setDirectExpenses(JSON.parse(cachedDirect));
    else setDirectExpenses(DEMO_DIRECT_EXPENSES);

    if (cachedFood) setFoodItems(JSON.parse(cachedFood));
    else setFoodItems(DEMO_FOOD_ITEMS);

    if (cachedDark) setDarkMode(JSON.parse(cachedDark));
  }, []);

  useEffect(() => {
    if (trips.length > 0) localStorage.setItem('camplog_v2_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    if (sharedExpenses.length > 0) localStorage.setItem('camplog_v2_shared', JSON.stringify(sharedExpenses));
  }, [sharedExpenses]);

  useEffect(() => {
    if (directExpenses.length > 0) localStorage.setItem('camplog_v2_direct', JSON.stringify(directExpenses));
  }, [directExpenses]);

  useEffect(() => {
    if (foodItems.length > 0) localStorage.setItem('camplog_v2_food', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('camplog_v2_dark', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // === NOTIFICATION HANDLER ===
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // === UTILITIES & CALCULATIONS ===
  const getSharedExpenseForTrip = (tripId) => {
    return sharedExpenses
      .filter(item => item.tripIds && item.tripIds.includes(tripId))
      .reduce((sum, item) => sum + (item.amount / (item.tripIds.length || 1)), 0);
  };

  const getDirectExpenseForTrip = (tripId) => {
    return directExpenses
      .filter(item => item.tripId === tripId)
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  // ดึงยอดแชร์ค่าเสบียงเฉลี่ยสำหรับทริปนี้
  const getFoodExpenseForTrip = (tripId) => {
    return foodItems
      .filter(item => item.tripIds && item.tripIds.includes(tripId))
      .reduce((sum, item) => {
        const itemTotal = item.quantity * item.unitPrice;
        const shareCount = item.tripIds.length || 1;
        return sum + (itemTotal / shareCount);
      }, 0);
  };

  const totalFoodCost = useMemo(() => {
    return foodItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [foodItems]);

  const totalDirectAll = useMemo(() => {
    return directExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [directExpenses]);

  const totalSharedAll = useMemo(() => {
    return sharedExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [sharedExpenses]);

  const grandTotalCost = totalDirectAll + totalSharedAll + totalFoodCost;
  const averageTripCost = trips.length > 0 ? grandTotalCost / trips.length : 0;

  const mostVisitedProvince = useMemo(() => {
    if (trips.length === 0) return 'ไม่มีข้อมูล';
    const counts = {};
    trips.forEach(t => counts[t.province] = (counts[t.province] || 0) + 1);
    let maxProv = '';
    let maxCount = 0;
    Object.entries(counts).forEach(([prov, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxProv = prov;
      }
    });
    return `${maxProv} (${maxCount} ครั้ง)`;
  }, [trips]);

  const handleImageToBase64 = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trip.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trip.province.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'ALL' || trip.status === statusFilter;
      const matchProvince = provinceFilter === 'all' || trip.province === provinceFilter;
      
      let matchMonth = true;
      if (monthFilter !== 'all') {
        const tripMonth = new Date(trip.startDate).getMonth() + 1;
        matchMonth = tripMonth.toString() === monthFilter;
      }

      return matchSearch && matchStatus && matchProvince && matchMonth;
    });
  }, [trips, searchTerm, statusFilter, provinceFilter, monthFilter]);

  const uniqueProvinces = useMemo(() => {
    return [...new Set(trips.map(t => t.province))];
  }, [trips]);

  const monthsThai = [
    { value: '1', label: 'มกราคม' }, { value: '2', label: 'กุมภาพันธ์' }, { value: '3', label: 'มีนาคม' },
    { value: '4', label: 'เมษายน' }, { value: '5', label: 'พฤษภาคม' }, { value: '6', label: 'มิถุนายน' },
    { value: '7', label: 'กรกฎาคม' }, { value: '8', label: 'สิงหาคม' }, { value: '9', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' }, { value: '11', label: 'พฤศจิกายน' }, { value: '12', label: 'ธันวาคม' }
  ];

  // === TRIP ACTIONS ===
  const handleAddTripOpen = () => {
    setEditingTripId(null);
    setTripForm({
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: '',
      province: '',
      status: 'PLANNING',
      coverImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
      notes: ''
    });
    setShowTripModal(true);
  };

  const handleEditTripOpen = (trip) => {
    setEditingTripId(trip.id);
    setTripForm({ ...trip });
    setShowTripModal(true);
  };

  const handleSaveTrip = (e) => {
    e.preventDefault();
    if (!tripForm.title || !tripForm.startDate || !tripForm.location || !tripForm.province) {
      triggerToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (editingTripId) {
      setTrips(trips.map(t => t.id === editingTripId ? { ...t, ...tripForm } : t));
      triggerToast('อัปเดตข้อมูลทริปเรียบร้อยแล้ว');
    } else {
      const newTrip = { ...tripForm, id: 'trip-' + Date.now() };
      setTrips([...trips, newTrip]);
      triggerToast('เพิ่มทริปใหม่เรียบร้อยแล้ว');
    }
    setShowTripModal(false);
  };

  const handleDeleteTrip = (id) => {
    if (window.confirm('คุณแน่ใจว่าต้องการลบทริปนี้? รายการค่าใช้จ่ายเฉพาะทริปทั้งหมดจะถูกลบไปด้วย')) {
      setTrips(trips.filter(t => t.id !== id));
      setDirectExpenses(directExpenses.filter(d => d.tripId !== id));
      
      // ปรับลดทริปที่แชร์ออกจากส่วนกลาง
      setSharedExpenses(sharedExpenses.map(s => ({
        ...s,
        tripIds: s.tripIds.filter(tid => tid !== id)
      })).filter(s => s.tripIds.length > 0));

      // ปรับลดทริปที่แชร์ออกจากเสบียง
      setFoodItems(foodItems.map(f => ({
        ...f,
        tripIds: f.tripIds ? f.tripIds.filter(tid => tid !== id) : []
      })).filter(f => f.tripIds && f.tripIds.length > 0));

      triggerToast('ลบทริปเรียบร้อยแล้ว');
    }
  };

  // === SHARED EXPENSES ACTIONS ===
  const handleAddSharedOpen = () => {
    setEditingSharedId(null);
    setSharedForm({
      title: '',
      category: 'อุปกรณ์',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      tripIds: trips.length > 0 ? [trips[0].id] : []
    });
    setShowSharedModal(true);
  };

  const handleEditSharedOpen = (item) => {
    setEditingSharedId(item.id);
    setSharedForm({ ...item });
    setShowSharedModal(true);
  };

  const handleSaveShared = (e) => {
    e.preventDefault();
    if (!sharedForm.title || !sharedForm.amount || sharedForm.tripIds.length === 0) {
      triggerToast('กรุณากรอกชื่อและราคา และเลือกทริปอย่างน้อย 1 ทริป');
      return;
    }

    const itemData = { ...sharedForm, amount: Number(sharedForm.amount) };

    if (editingSharedId) {
      setSharedExpenses(sharedExpenses.map(s => s.id === editingSharedId ? { ...s, ...itemData } : s));
      triggerToast('อัปเดตค่าใช้จ่ายส่วนกลางเรียบร้อย');
    } else {
      const newItem = { ...itemData, id: 'shared-' + Date.now() };
      setSharedExpenses([...sharedExpenses, newItem]);
      triggerToast('บันทึกค่าใช้จ่ายส่วนกลางใหม่เรียบร้อย');
    }
    setShowSharedModal(false);
  };

  const handleDeleteShared = (id) => {
    if (window.confirm('ต้องการลบรายการส่วนกลางนี้ใช่หรือไม่?')) {
      setSharedExpenses(sharedExpenses.filter(s => s.id !== id));
      triggerToast('ลบรายการเรียบร้อยแล้ว');
    }
  };

  // === DIRECT EXPENSES ACTIONS ===
  const handleAddDirectOpen = (defaultTripId = '') => {
    setEditingDirectId(null);
    setDirectForm({
      tripId: defaultTripId || (trips.length > 0 ? trips[0].id : ''),
      title: '',
      type: 'calculated',
      peopleCount: 1,
      nightCount: 1,
      pricePerPersonNight: '',
      amount: '',
      receiptImage: ''
    });
    setShowDirectModal(true);
  };

  const handleEditDirectOpen = (item) => {
    setEditingDirectId(item.id);
    setDirectForm({ ...item });
    setShowDirectModal(true);
  };

  const handleSaveDirect = (e) => {
    e.preventDefault();
    if (!directForm.tripId || !directForm.title) {
      triggerToast('กรุณาระบุข้อมูลทริปและหัวข้อค่าใช้จ่าย');
      return;
    }

    let calculatedAmount = 0;
    if (directForm.type === 'calculated') {
      calculatedAmount = Number(directForm.peopleCount || 1) * Number(directForm.nightCount || 1) * Number(directForm.pricePerPersonNight || 0);
    } else {
      calculatedAmount = Number(directForm.amount || 0);
    }

    const itemData = {
      ...directForm,
      amount: calculatedAmount,
      pricePerPersonNight: Number(directForm.pricePerPersonNight || 0),
      peopleCount: Number(directForm.peopleCount || 1),
      nightCount: Number(directForm.nightCount || 1)
    };

    if (editingDirectId) {
      setDirectExpenses(directExpenses.map(d => d.id === editingDirectId ? { ...d, ...itemData } : d));
      triggerToast('อัปเดตค่าใช้จ่ายเฉพาะทริปเรียบร้อย');
    } else {
      const newItem = { ...itemData, id: 'direct-' + Date.now() };
      setDirectExpenses([...directExpenses, newItem]);
      triggerToast('บันทึกค่าใช้จ่ายเฉพาะทริปใหม่เรียบร้อย');
    }
    setShowDirectModal(false);
  };

  const handleDeleteDirect = (id) => {
    if (window.confirm('ต้องการลบค่าใช้จ่ายนี้?')) {
      setDirectExpenses(directExpenses.filter(d => d.id !== id));
      triggerToast('ลบรายการสำเร็จ');
    }
  };

  // === FOOD PREP ACTIONS ===
  const handleSaveFoodItem = (e) => {
    e.preventDefault();
    if (!foodForm.title || !foodForm.unitPrice) {
      triggerToast('กรุณากรอกรายละเอียดอาหารและราคา');
      return;
    }

    if (!foodForm.tripIds || foodForm.tripIds.length === 0) {
      triggerToast('กรุณาเลือกทริปที่จะร่วมแชร์ค่าเสบียงอย่างน้อย 1 ทริป');
      return;
    }

    const parsedItem = {
      title: foodForm.title,
      quantity: Number(foodForm.quantity || 1),
      unitPrice: Number(foodForm.unitPrice || 0),
      tripIds: foodForm.tripIds, // บันทึกข้อมูลทริปที่แชร์
      completed: false
    };

    if (editingFoodId) {
      setFoodItems(foodItems.map(f => f.id === editingFoodId ? { ...f, ...parsedItem, completed: f.completed } : f));
      setEditingFoodId(null);
      triggerToast('แก้ไขรายการอาหารสำเร็จ');
    } else {
      const newItem = { ...parsedItem, id: 'food-' + Date.now() };
      setFoodItems([...foodItems, newItem]);
      triggerToast('เพิ่มรายการเตรียมอาหารใหม่และจัดแชร์เรียบร้อย');
    }

    setFoodForm({ title: '', quantity: 1, unitPrice: '', tripIds: trips.length > 0 ? [trips[0].id] : [] });
  };

  const handleToggleFoodCompleted = (id) => {
    setFoodItems(foodItems.map(f => f.id === id ? { ...f, completed: !f.completed } : f));
  };

  const handleDeleteFoodItem = (id) => {
    setFoodItems(foodItems.filter(f => f.id !== id));
    triggerToast('ลบรายการอาหารสำเร็จ');
  };

  // === EXPORT TO EXCEL-FRIENDLY CSV ===
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    csvContent += "=== รายการทริปแคมป์ปิ้ง ===\n";
    csvContent += "ชื่อทริป,สถานะ,วันที่เดินทาง,วันที่กลับ,สถานที่กางเต็นท์,จังหวัด,บันทึกเพิ่มเติม\n";
    trips.forEach(t => {
      csvContent += `"${t.title}","${TRIP_STATUSES[t.status]?.label}","${t.startDate}","${t.endDate}","${t.location}","${t.province}","${t.notes.replace(/"/g, '""')}"\n`;
    });

    csvContent += "\n=== ค่าใช้จ่ายส่วนกลาง ===\n";
    csvContent += "ชื่อรายการ,หมวดหมู่,จำนวนเงินรวม,วันที่แชร์,แชร์จำนวนกี่ทริป\n";
    sharedExpenses.forEach(s => {
      csvContent += `"${s.title}","${s.category}",${s.amount},"${s.date}",${s.tripIds ? s.tripIds.length : 0}\n`;
    });

    csvContent += "\n=== ค่าใช้จ่ายส่วนตัวเฉพาะทริป ===\n";
    csvContent += "ชื่อรายการ,ทริปอ้างอิง,ประเภท,คน,คืน,ราคาต่อหน่วย,ราคารวม\n";
    directExpenses.forEach(d => {
      const trip = trips.find(t => t.id === d.tripId);
      csvContent += `"${d.title}","${trip ? trip.title : 'N/A'}","${d.type === 'calculated' ? 'คำนวณรายหัว' : 'เหมาจ่าย'}",${d.peopleCount},${d.nightCount},${d.pricePerPersonNight},${d.amount}\n`;
    });

    csvContent += "\n=== รายการเตรียมอาหาร ===\n";
    csvContent += "รายการ,จำนวน,ราคาต่อชิ้น,รวมราคา,จำนวนแชร์ทริป,สถานะจัดเตรียม\n";
    foodItems.forEach(f => {
      csvContent += `"${f.title}",${f.quantity},${f.unitPrice},${f.quantity * f.unitPrice},${f.tripIds ? f.tripIds.length : 0},"${f.completed ? 'จัดเตรียมแล้ว' : 'ยังไม่ได้เตรียม'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `Camping_Data_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    triggerToast('ดาวน์โหลดเอกสาร CSV สำหรับเปิดใน Excel สำเร็จ!');
  };

  const handleLoadDemo = () => {
    setTrips(DEMO_TRIPS);
    setSharedExpenses(DEMO_SHARED_EXPENSES);
    setDirectExpenses(DEMO_DIRECT_EXPENSES);
    setFoodItems(DEMO_FOOD_ITEMS);
    triggerToast('โหลดข้อมูลทดสอบระบบแคมป์ปิ้งเรียบร้อย!');
  };

  const handleClearAll = () => {
    if (window.confirm('คุณยืนยันต้องการลบข้อมูลทั้งหมด?')) {
      setTrips([]);
      setSharedExpenses([]);
      setDirectExpenses([]);
      setFoodItems([]);
      localStorage.removeItem('camplog_v2_trips');
      localStorage.removeItem('camplog_v2_shared');
      localStorage.removeItem('camplog_v2_direct');
      localStorage.removeItem('camplog_v2_food');
      triggerToast('ล้างฐานข้อมูลเรียบร้อยแล้ว');
    }
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors font-sans select-none ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-zinc-800'}`}>
      
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce text-xs font-semibold">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 py-3 flex items-center justify-between ${darkMode ? 'bg-zinc-900/90 border-zinc-850' : 'bg-white/90 border-stone-200'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-2 rounded-xl shadow-md">
            <Compass size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight flex items-center gap-1">
              CampLog <span className="text-emerald-500 font-medium text-xs">V2 PRO</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-medium">Outdoor Trip Expense Planner</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {trips.length === 0 && (
            <button 
              onClick={handleLoadDemo}
              className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1"
            >
              <Sparkles size={12} />
              <span>โหลดตัวอย่างทริป</span>
            </button>
          )}

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-zinc-800 text-amber-400' : 'bg-stone-100 text-zinc-600 hover:bg-stone-200'}`}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-5">

        {/* 1. DASHBOARD PANEL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-stone-900 text-white p-5 shadow-xl">
              <div className="relative z-10 space-y-2">
                <div className="inline-block bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                  Let's explore mountains & forests ??????
                </div>
                <h2 className="text-xl font-extrabold leading-snug">บันทึกทุกก้าวทริปกางเต็นท์ของคุณ</h2>
                <p className="text-emerald-100/75 text-xs font-light leading-relaxed">
                  จัดการค่าใช้จ่ายแชร์รถ, อุปกรณ์, และสเบียงเตรียมแคมป์ ครบจบในเครื่องเดียวด้วยฟิลเตอร์กรองสถานะระดับโปร
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button 
                    onClick={handleAddTripOpen}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition"
                  >
                    <Plus size={14} /> เพิ่มทริปของคุณ
                  </button>
                  <button 
                    onClick={handleExportCSV}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1 transition"
                  >
                    <Download size={13} /> ส่งออกข้อมูล Excel
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'}`}>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">ทริปทั้งหมด</p>
                <p className="text-xl font-extrabold mt-1 text-emerald-500">{trips.length} <span className="text-xs font-normal text-zinc-400">ทริป</span></p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'}`}>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">รวมค่าใช้จ่าย</p>
                <p className="text-xl font-extrabold mt-1 text-amber-500">฿{grandTotalCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'}`}>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">เฉลี่ยต่อทริป</p>
                <p className="text-xl font-extrabold mt-1 text-indigo-500">฿{averageTripCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'}`}>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">ไปกางบ่อยที่สุด</p>
                <p className="text-xs font-bold mt-1 text-zinc-500 truncate" title={mostVisitedProvince}>{mostVisitedProvince}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className={`md:col-span-2 p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <Clock size={14} className="text-emerald-500" /> ทริปล่าสุดในสารบบ
                  </h3>
                  <button onClick={() => setActiveTab('trips')} className="text-xs text-emerald-500 font-bold hover:underline">
                    ดูทริปทั้งหมด ?
                  </button>
                </div>

                {trips.length === 0 ? (
                  <div className="text-center py-10 border border-dashed rounded-xl dark:border-zinc-800">
                    <p className="text-xs text-zinc-400">ยังไม่มีข้อมูลทริปการกางเต็นท์สะสม</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {trips.slice(0, 3).map(trip => {
                      const totalDirect = getDirectExpenseForTrip(trip.id);
                      const totalShared = getSharedExpenseForTrip(trip.id);
                      const totalFood = getFoodExpenseForTrip(trip.id); // รวมค่าอาหารที่แชร์ทริปนี้
                      const statusConf = TRIP_STATUSES[trip.status];

                      return (
                        <div 
                          key={trip.id}
                          className={`p-3 rounded-xl border flex items-center gap-3 transition ${darkMode ? 'bg-zinc-900/40 hover:bg-zinc-800/40 border-zinc-850' : 'bg-stone-50 hover:bg-stone-100/50 border-stone-200'}`}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={trip.coverImage} className="w-full h-full object-cover" alt="" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold truncate">{trip.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${statusConf?.color}`}>
                                {statusConf?.label}
                              </span>
                              <span className="text-[10px] text-zinc-400 truncate">{trip.location}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-zinc-400">ยอดงบประมาณ</p>
                            <p className="text-xs font-extrabold text-amber-500">฿{(totalDirect + totalShared + totalFood).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wide flex items-center gap-1">
                    <Utensils size={14} className="text-emerald-500" /> สเบียงเตรียมแคมป์
                  </h3>
                  <button onClick={() => setActiveTab('food')} className="text-xs text-emerald-500 font-bold hover:underline">
                    จัดสเบียง ?
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-zinc-400">งบจัดเตรียมอาหารสะสม: <span className="font-bold text-zinc-800 dark:text-zinc-100">฿{totalFoodCost.toLocaleString()}</span></p>
                  
                  {foodItems.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-3 text-center">ไม่มีรายการเตรียมไว้</p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {foodItems.slice(0, 3).map(food => (
                        <div key={food.id} className="flex justify-between items-center text-[11px]">
                          <span className={`truncate max-w-[120px] ${food.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                            {food.title}
                          </span>
                          <span className="font-medium text-zinc-400">x{food.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. TRIPS TAB */}
        {activeTab === 'trips' && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-1.5">
                  <Compass className="text-emerald-500 animate-spin-slow" /> ทริปเดินทางแคมป์ปิ้งทั้งหมด ({filteredTrips.length})
                </h2>
                <p className="text-xs text-zinc-400">บริหารการเดินทาง อัปเดตสถานะของแต่ละทริปอย่างเป็นระบบ</p>
              </div>

              <button 
                onClick={handleAddTripOpen}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition text-xs shadow-md"
              >
                <Plus size={15} /> สร้างแผนทริปใหม่
              </button>
            </div>

            <div className={`p-4 rounded-xl border space-y-3.5 ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="ค้นหาตามชื่อทริป, แหล่งกางเต็นท์, จังหวัด..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg outline-none border transition-colors ${darkMode ? 'bg-zinc-800 border-zinc-750 text-white focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'}`}
                />
              </div>

              <div className="border-t pt-3 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] text-zinc-400 font-bold uppercase mr-1.5">สถานะทริป:</span>
                <button 
                  onClick={() => setStatusFilter('ALL')}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition ${statusFilter === 'ALL' ? 'bg-emerald-600 text-white' : 'bg-stone-100 dark:bg-zinc-800 text-zinc-500'}`}
                >
                  ทั้งหมด
                </button>
                <button 
                  onClick={() => setStatusFilter('PLANNING')}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 ${statusFilter === 'PLANNING' ? 'bg-amber-600 text-white' : 'bg-stone-100 dark:bg-zinc-800 text-zinc-500'}`}
                >
                  <Clock size={10} /> กำลังวางแผน
                </button>
                <button 
                  onClick={() => setStatusFilter('UPCOMING')}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 ${statusFilter === 'UPCOMING' ? 'bg-emerald-600 text-white' : 'bg-stone-100 dark:bg-zinc-800 text-zinc-500'}`}
                >
                  <Compass size={10} /> กำลังจะไป
                </button>
                <button 
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 ${statusFilter === 'COMPLETED' ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900' : 'bg-stone-100 dark:bg-zinc-800 text-zinc-500'}`}
                >
                  <CheckCircle2 size={10} /> ไปมาแล้ว
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t pt-3">
                <select 
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className={`text-[11px] py-1.5 px-3 rounded-lg border outline-none cursor-pointer ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                >
                  <option value="all">ทุกจังหวัด</option>
                  {uniqueProvinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <select 
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className={`text-[11px] py-1.5 px-3 rounded-lg border outline-none cursor-pointer ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                >
                  <option value="all">ทุกเดือน</option>
                  {monthsThai.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-2xl dark:border-zinc-850">
                <Compass size={32} className="mx-auto text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-400">ไม่พบข้อมูลแผนการเดินทางตามเงื่อนไขที่เลือก</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTrips.map(trip => {
                  const directVal = getDirectExpenseForTrip(trip.id);
                  const sharedVal = getSharedExpenseForTrip(trip.id);
                  const foodVal = getFoodExpenseForTrip(trip.id);
                  const total = directVal + sharedVal + foodVal;
                  const statusConf = TRIP_STATUSES[trip.status];

                  return (
                    <div 
                      key={trip.id}
                      className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-xs transition hover:-translate-y-1 ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}
                    >
                      <div className="relative h-40 bg-zinc-800">
                        <img src={trip.coverImage} className="w-full h-full object-cover" alt="" />
                        
                        <div className="absolute top-2.5 left-2.5 flex gap-1">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${statusConf?.color}`}>
                            {statusConf?.label}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 bg-stone-950/80 backdrop-blur-xs text-white text-[9px] py-0.5 px-2 rounded-full font-bold">
                          ?? {trip.province}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100">{trip.title}</h3>
                          
                          <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                            <MapPin size={11} /> {trip.location}
                          </p>

                          <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={11} /> {trip.startDate} ถึง {trip.endDate}
                          </p>

                          {trip.notes && (
                            <p className="text-[11px] bg-stone-100 dark:bg-zinc-800 text-zinc-400 rounded-lg p-2 mt-2.5 line-clamp-2">
                              {trip.notes}
                            </p>
                          )}
                        </div>

                        <div className="border-t pt-3 mt-4 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] text-zinc-400 uppercase font-extrabold tracking-wider">งบเดินทางรวม</p>
                            <p className="text-sm font-black text-amber-500">฿{total.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                          </div>

                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleEditTripOpen(trip)}
                              className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button 
                              onClick={() => handleAddDirectOpen(trip.id)}
                              className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500/20"
                              title="เพิ่มค่าใช้จ่ายเข้าทริปโดยตรง"
                            >
                              <DollarSign size={12} />
                            </button>
                            <button 
                              onClick={() => handleDeleteTrip(trip.id)}
                              className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-1.5">
                  <DollarSign className="text-emerald-500 animate-pulse" /> จัดการค่าใช้จ่ายส่วนกลาง & ค่าใช้จ่ายทริป
                </h2>
                <p className="text-xs text-zinc-400">ระบุรายละเอียดค่าน้ำมัน อุปกรณ์แคมป์ ค่าบริการลาน หรือค่าเหมาจ่าย</p>
              </div>

              <div className="flex gap-1.5">
                <button 
                  onClick={handleAddSharedOpen}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-3 rounded-xl text-[11px] shadow"
                >
                  + ส่วนกลาง (Shared)
                </button>
                <button 
                  onClick={() => handleAddDirectOpen()}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold py-2 px-3 rounded-xl text-[11px] shadow"
                >
                  + เฉพาะทริป (Direct)
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider">A) ค่าใช้จ่ายส่วนกลาง (Shared Expenses)</h3>
                <span className="text-xs font-bold text-amber-500">฿{totalSharedAll.toLocaleString()}</span>
              </div>

              {sharedExpenses.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">ยังไม่มีข้อมูลค่าใช้จ่ายส่วนกลางแชร์กัน</p>
              ) : (
                <div className="space-y-2">
                  {sharedExpenses.map(item => (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${darkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-800 dark:text-zinc-100">{item.title}</span>
                          <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">{item.category}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">ซื้อเมื่อ: {item.date} {item.notes && `• ${item.notes}`}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          <span className="text-[9px] text-zinc-400 font-bold">แชร์ร่วม {item.tripIds.length} ทริป:</span>
                          {item.tripIds.map(tid => {
                            const match = trips.find(t => t.id === tid);
                            return (
                              <span key={tid} className="text-[8px] bg-stone-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                                {match ? match.title : 'Deleted Trip'}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-2 sm:pt-0 border-stone-100 dark:border-zinc-800">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-amber-500">฿{item.amount.toLocaleString()}</p>
                          {item.tripIds.length > 1 && (
                            <p className="text-[9px] text-emerald-500 font-semibold">
                              (ตกทริปละ ฿{(item.amount / item.tripIds.length).toFixed(0)})
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <button onClick={() => handleEditSharedOpen(item)} className="p-1 text-zinc-400 hover:text-emerald-500"><Edit3 size={12} /></button>
                          <button onClick={() => handleDeleteShared(item.id)} className="p-1 text-zinc-400 hover:text-red-500"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider">B) ค่าใช้จ่ายเฉพาะสถานที่กาง (Direct Expenses)</h3>
                <span className="text-xs font-bold text-emerald-500">฿{totalDirectAll.toLocaleString()}</span>
              </div>

              {directExpenses.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">ยังไม่มีการบันทึกค่าใช้จ่ายเฉพาะทริป</p>
              ) : (
                <div className="space-y-2">
                  {directExpenses.map(item => {
                    const matchTrip = trips.find(t => t.id === item.tripId);
                    return (
                      <div 
                        key={item.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${darkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}
                      >
                        <div>
                          <p className="font-bold text-zinc-800 dark:text-zinc-100">{item.title}</p>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            ทริป: <span className="font-semibold text-zinc-600 dark:text-zinc-300">{matchTrip ? matchTrip.title : 'N/A'}</span>
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            {item.type === 'calculated' ? `คำนวณตามหัว: ${item.peopleCount} คน • ${item.nightCount} คืน (คืนละ ฿${item.pricePerPersonNight})` : 'จ่ายแบบอัตราเหมา'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-2 sm:pt-0 border-stone-100 dark:border-zinc-800">
                          <p className="font-bold text-emerald-500 text-right">฿{item.amount.toLocaleString()}</p>
                          
                          <div className="flex gap-1">
                            <button onClick={() => handleEditDirectOpen(item)} className="p-1 text-zinc-400 hover:text-emerald-500"><Edit3 size={12} /></button>
                            <button onClick={() => handleDeleteDirect(item.id)} className="p-1 text-zinc-400 hover:text-red-500"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 4. FOOD PREP TAB */}
        {activeTab === 'food' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-extrabold flex items-center gap-1.5">
                <Utensils className="text-emerald-500" /> ตารางเสบียงและวัตถุดิบปิ้งย่าง ({foodItems.length})
              </h2>
              <p className="text-xs text-zinc-400">ลงรายการของกิน น้ำดื่ม และของสดส่วนกลาง และเลือกว่าจะใช้แชร์ร่วมกันในทริปใดบ้าง</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className={`p-4 rounded-xl border h-fit ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h3 className="font-bold text-xs text-zinc-400 mb-3 uppercase">
                  {editingFoodId ? 'แก้ไขของกินเสบียง' : 'ระบุของกินเพิ่มเติม'}
                </h3>
                
                <form onSubmit={handleSaveFoodItem} className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">ชื่อสเบียง / ของกิน *</label>
                    <input 
                      type="text" 
                      placeholder="เช่น ข้าวสาร, หมูกระทะ"
                      value={foodForm.title}
                      onChange={(e) => setFoodForm({ ...foodForm, title: e.target.value })}
                      className={`w-full text-xs p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-850 border-zinc-750 text-white' : 'bg-stone-50 border-stone-200'}`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1">จำนวนหน่วย</label>
                      <input 
                        type="number" 
                        min="1"
                        value={foodForm.quantity}
                        onChange={(e) => setFoodForm({ ...foodForm, quantity: Number(e.target.value) })}
                        className={`w-full text-xs p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-850 border-zinc-750 text-white' : 'bg-stone-50 border-stone-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 mb-1">ราคาต่อหน่วย</label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="บาท"
                        value={foodForm.unitPrice}
                        onChange={(e) => setFoodForm({ ...foodForm, unitPrice: Number(e.target.value) })}
                        className={`w-full text-xs p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-850 border-zinc-750 text-white' : 'bg-stone-50 border-stone-200'}`}
                        required
                      />
                    </div>
                  </div>

                  {/* Trip checkbox selector for Food sharing */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1.5">ร่วมแชร์เฉลี่ยสเบียงให้ทริปต่อไปนี้ *</label>
                    {trips.length === 0 ? (
                      <p className="text-[10px] text-amber-500">กรุณาสร้างแผนทริปก่อนเพื่อร่วมแชร์ค่าอาหาร</p>
                    ) : (
                      <div className="border rounded-lg p-2 max-h-32 overflow-y-auto dark:border-zinc-800 space-y-1 bg-white dark:bg-zinc-900">
                        {trips.map(trip => {
                          const isCheck = foodForm.tripIds && foodForm.tripIds.includes(trip.id);
                          return (
                            <label key={trip.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-800">
                              <input 
                                type="checkbox"
                                checked={isCheck || false}
                                onChange={() => {
                                  const currentIds = foodForm.tripIds || [];
                                  if (isCheck) {
                                    setFoodForm({ ...foodForm, tripIds: currentIds.filter(id => id !== trip.id) });
                                  } else {
                                    setFoodForm({ ...foodForm, tripIds: [...currentIds, trip.id] });
                                  }
                                }}
                                className="rounded text-emerald-600 focus:ring-emerald-500"
                              />
                              <span className="truncate text-[10px]">{trip.title}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {foodForm.title && foodForm.unitPrice && (
                    <div className="text-center text-xs font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                      ราคารวมคำนวณ: ฿{(foodForm.quantity * foodForm.unitPrice).toLocaleString()}
                      {foodForm.tripIds && foodForm.tripIds.length > 1 && (
                        <p className="text-[9px] text-zinc-400 font-normal mt-0.5">
                          (ตกทริปละ ฿{((foodForm.quantity * foodForm.unitPrice) / foodForm.tripIds.length).toFixed(0)} - หาร {foodForm.tripIds.length} ทริป)
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg">
                      {editingFoodId ? 'อัปเดต' : 'เพิ่มรายการ'}
                    </button>
                    {editingFoodId && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingFoodId(null); setFoodForm({ title: '', quantity: 1, unitPrice: '', tripIds: trips.length > 0 ? [trips[0].id] : [] }); }}
                        className="bg-stone-200 dark:bg-zinc-800 text-xs px-3 rounded-lg"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className={`md:col-span-2 p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-xs text-zinc-400 uppercase">ลิสต์เสบียงและสัดส่วนแชร์ทริป</h3>
                  <span className="text-xs font-black text-emerald-500">รวมทั้งหมด ฿{totalFoodCost.toLocaleString()}</span>
                </div>

                {foodItems.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-10">ยังไม่มีประวัติสเบียงลงไว้</p>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {foodItems.map(item => (
                      <div 
                        key={item.id}
                        className={`p-3 rounded-lg border flex items-center justify-between text-xs transition ${item.completed ? 'opacity-60 bg-emerald-500/5' : ''} ${darkMode ? 'bg-zinc-900/30 border-zinc-850' : 'bg-stone-50 border-stone-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleFoodCompleted(item.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300 hover:border-emerald-500'}`}
                          >
                            {item.completed && <Check size={11} />}
                          </button>
                          
                          <div>
                            <p className={`font-bold ${item.completed ? 'line-through text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'}`}>{item.title}</p>
                            <p className="text-[10px] text-zinc-400">ราคา ฿{item.unitPrice} • จำนวน {item.quantity} หน่วย</p>
                            
                            {/* Tags showing shared trips */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              <span className="text-[8px] text-zinc-400 font-bold">หารร่วม {item.tripIds ? item.tripIds.length : 0} ทริป:</span>
                              {item.tripIds && item.tripIds.map(tid => {
                                const match = trips.find(t => t.id === tid);
                                return (
                                  <span key={tid} className="text-[8px] bg-stone-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                                    {match ? match.title : 'Deleted Trip'}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-2 text-right">
                          <div>
                            <span className="font-extrabold text-xs">฿{(item.quantity * item.unitPrice).toLocaleString()}</span>
                            {item.tripIds && item.tripIds.length > 1 && (
                              <p className="text-[9px] text-emerald-500 font-bold">
                                (เฉลี่ย ฿{((item.quantity * item.unitPrice) / item.tripIds.length).toFixed(0)} / ทริป)
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-1.5">
                            <button onClick={() => { setEditingFoodId(item.id); setFoodForm({ ...item }); }} className="text-zinc-400 hover:text-emerald-500"><Edit3 size={12} /></button>
                            <button onClick={() => handleDeleteFoodItem(item.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 5. STATISTICS & GRAPHS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-extrabold flex items-center gap-1.5">
                <BarChart3 className="text-emerald-500 animate-pulse" /> สรุปสถิติค่าใช้จ่ายในเชิงลึก
              </h2>
              <p className="text-xs text-zinc-400">เจาะลึกงบประมาณแยกประเภทเพื่อวางแผนการเงินในแผนทริปครั้งหน้า</p>
            </div>

            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
              <h3 className="font-bold text-xs text-zinc-400 mb-3.5 uppercase flex items-center gap-1"><PieChart size={14} /> โครงสร้างสัดส่วนรวม (Grand Cost Structure)</h3>
              
              <div className="space-y-3.5">
                <div className="flex h-10 w-full rounded-full overflow-hidden border border-stone-200 dark:border-zinc-800">
                  <div 
                    className="bg-emerald-500 h-full flex items-center justify-center text-[9px] text-white font-extrabold"
                    style={{ width: `${grandTotalCost > 0 ? (totalDirectAll/grandTotalCost)*100 : 33.3}%` }}
                  >
                    {grandTotalCost > 0 ? `${((totalDirectAll/grandTotalCost)*100).toFixed(0)}%` : ''}
                  </div>
                  <div 
                    className="bg-amber-500 h-full flex items-center justify-center text-[9px] text-white font-extrabold"
                    style={{ width: `${grandTotalCost > 0 ? (totalSharedAll/grandTotalCost)*100 : 33.3}%` }}
                  >
                    {grandTotalCost > 0 ? `${((totalSharedAll/grandTotalCost)*100).toFixed(0)}%` : ''}
                  </div>
                  <div 
                    className="bg-indigo-500 h-full flex items-center justify-center text-[9px] text-white font-extrabold"
                    style={{ width: `${grandTotalCost > 0 ? (totalFoodCost/grandTotalCost)*100 : 33.3}%` }}
                  >
                    {grandTotalCost > 0 ? `${((totalFoodCost/grandTotalCost)*100).toFixed(0)}%` : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full shrink-0"></span>
                    <div>
                      <p className="text-zinc-400 text-[10px]">เฉพาะสถานที่กาง</p>
                      <p className="font-extrabold">฿{totalDirectAll.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-500 rounded-full shrink-0"></span>
                    <div>
                      <p className="text-zinc-400 text-[10px]">ส่วนกลาง (หารแชร์)</p>
                      <p className="font-extrabold">฿{totalSharedAll.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full shrink-0"></span>
                    <div>
                      <p className="text-zinc-400 text-[10px]">เตรียมของกินแคมป์</p>
                      <p className="font-extrabold">฿{totalFoodCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
              <h3 className="font-bold text-xs text-zinc-400 mb-3.5 uppercase">สรุปงบจริงรายทริปเดินทาง</h3>

              {trips.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">ไม่มีประวัติสำหรับคำนวณ</p>
              ) : (
                <div className="space-y-3.5">
                  {trips.map(trip => {
                    const direct = getDirectExpenseForTrip(trip.id);
                    const shared = getSharedExpenseForTrip(trip.id);
                    const food = getFoodExpenseForTrip(trip.id);
                    const sum = direct + shared + food;

                    return (
                      <div key={trip.id} className="border-b dark:border-zinc-850 last:border-0 pb-3 last:pb-0 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-zinc-800 dark:text-zinc-100">{trip.title}</span>
                          <span className="text-amber-500">฿{sum.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                          <span>ลานกาง: {trip.location}, {trip.province}</span>
                          <span>(เฉพาะทริป: ฿{direct.toLocaleString()} | แชร์ส่วนกลาง: ฿{shared.toLocaleString()} | อาหาร: ฿{food.toFixed(0)})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 6. SETTINGS & UTILITY PANEL */}
        {activeTab === 'settings' && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-extrabold flex items-center gap-1.5">
                <Settings className="text-emerald-500" /> ตั้งค่าความปลอดภัย & การส่งรายงานออก
              </h2>
              <p className="text-xs text-zinc-400">ควบคุมระบบแคชจัดเก็บ สำรองข้อมูลแคมป์ปิ้ง หรือส่งมอบรายงานให้สมาชิกกลุ่ม</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h3 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 mb-1 flex items-center gap-1"><FileText size={14} /> ส่งรายงานสเปรดชีต</h3>
                <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">ดาวน์โหลดฐานข้อมูลที่รวบรวมทริปและการเงินทั้งหมดของคุณเป็นไฟล์สกุล CSV สามารถเปิดใช้ใน Excel ได้ทันที</p>
                <div className="space-y-2">
                  <button 
                    onClick={handleExportCSV}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download size={14} /> ส่งออกไฟล์ CSV (Excel)
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="w-full bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-755 text-zinc-700 dark:text-zinc-200 font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5"
                  >
                    สั่งพิมพ์ข้อมูล PDF
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-stone-200'}`}>
                <h3 className="font-bold text-xs text-zinc-800 dark:text-zinc-100 mb-1">จัดการพื้นที่จัดเก็บ</h3>
                <p className="text-[11px] text-zinc-400 mb-4 leading-relaxed">ข้อมูลทั้งหมดของคุณจะถูกเข้ารหัสเซฟบนอุปกรณ์ปัจจุบัน (Local Storage) หากระบบขัดข้องหรืออยากเริ่มใหม่ สามารถเคลียร์ได้ที่นี่</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={handleLoadDemo}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-lg"
                  >
                    ทดสอบโหลดข้อมูลจำลองทริป
                  </button>
                  <button 
                    onClick={handleClearAll}
                    className="w-full bg-red-600/10 text-red-500 hover:bg-red-600/20 font-bold text-xs py-2.5 border border-red-500/20 rounded-lg"
                  >
                    เคลียร์แคชข้อมูลทั้งหมด
                  </button>
                </div>
              </div>

            </div>

            <div className="bg-gradient-to-r from-emerald-950/20 to-teal-950/10 p-4 rounded-xl border border-emerald-500/10 flex gap-3 text-xs">
              <Info className="text-emerald-500 shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-emerald-500">ระบบฟิลเตอร์และตรวจสอบสถานะช่วยอะไรคุณได้บ้าง?</h4>
                <p className="text-zinc-400 mt-1 leading-relaxed">
                  คุณสามารถคัดเลือกทริปที่ "เสร็จสิ้นแล้ว" เพื่อจัดเก็บสถิติด้านการเงินไว้เปรียบเทียบในแผงสถิติ และเก็บทริปที่ "กำลังจะไป" เพื่อเตรียมประเมินสเบียงและค่าแชร์ในหน้าของกิน ซึ่งระบบทั้งหมดจะปรับปรุงประมวลผลให้สอดคล้องกันโดยไม่ข้ามข้อมูลทริปอื่นครับ!
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ================= MODAL: TRIP FORM ================= */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-5 ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-stone-200 text-zinc-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
              <h3 className="font-extrabold text-sm text-emerald-500 flex items-center gap-1">
                <Compass size={16} /> {editingTripId ? 'แก้ไขประวัติแผนทริป' : 'เพิ่มแผนทริปกางเต็นท์ใหม่'}
              </h3>
              <button onClick={() => setShowTripModal(false)} className="text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 p-1 rounded-full"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-3 pt-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-400 mb-1">ชื่อทริปเดินทาง *</label>
                <input 
                  type="text" 
                  value={tripForm.title}
                  onChange={(e) => setTripForm({ ...tripForm, title: e.target.value })}
                  placeholder="ระบุชื่อทริปสไตล์คุณ"
                  className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">วันที่เริ่มต้นเดินทาง *</label>
                  <input 
                    type="date" 
                    value={tripForm.startDate}
                    onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">วันที่เดินทางกลับ *</label>
                  <input 
                    type="date" 
                    value={tripForm.endDate}
                    onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">สถานที่กางเต็นท์ *</label>
                  <input 
                    type="text" 
                    value={tripForm.location}
                    onChange={(e) => setTripForm({ ...tripForm, location: e.target.value })}
                    placeholder="เช่น ลานสนสามใบ"
                    className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">จังหวัด *</label>
                  <input 
                    type="text" 
                    value={tripForm.province}
                    onChange={(e) => setTripForm({ ...tripForm, province: e.target.value })}
                    placeholder="เช่น สระบุรี"
                    className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-400 mb-1">สถานะของแผนเดินทาง *</label>
                <select 
                  value={tripForm.status}
                  onChange={(e) => setTripForm({ ...tripForm, status: e.target.value })}
                  className={`w-full p-2.5 rounded-lg border outline-none cursor-pointer ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                >
                  <option value="PLANNING">กำลังวางแผน (Planning)</option>
                  <option value="UPCOMING">กำลังจะไป (Upcoming)</option>
                  <option value="COMPLETED">เสร็จสิ้นแล้ว (Completed)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-400 mb-1">ลิงก์รูปภาพปกทริป ( URL หรือ กล้องเลือกไฟล์)</label>
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={tripForm.coverImage}
                    onChange={(e) => setTripForm({ ...tripForm, coverImage: e.target.value })}
                    placeholder="วางลิงก์รูปภาพประกอบ"
                    className={`w-full p-2.5 rounded-lg border outline-none flex-1 ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                  />
                  <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg cursor-pointer flex items-center justify-center shrink-0">
                    <Camera size={15} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageToBase64(e, (b64) => setTripForm({ ...tripForm, coverImage: b64 }))} 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-400 mb-1">บันทึกช่วยจำเพิ่มเติม</label>
                <textarea 
                  rows="2"
                  value={tripForm.notes}
                  onChange={(e) => setTripForm({ ...tripForm, notes: e.target.value })}
                  placeholder="จดเช็คลิสต์ที่ต้องห้ามพลาด..."
                  className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t dark:border-zinc-800">
                <button type="button" onClick={() => setShowTripModal(false)} className="w-1/2 py-2.5 rounded-lg border font-semibold">ยกเลิก</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold">บันทึกข้อมูลทริป</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SHARED EXPENSE ================= */}
      {showSharedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-5 ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-stone-200 text-zinc-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
              <h3 className="font-extrabold text-sm text-amber-500 flex items-center gap-1">
                <DollarSign size={16} /> บันทึกค่าใช้จ่ายแชร์ส่วนกลาง (Shared)
              </h3>
              <button onClick={() => setShowSharedModal(false)} className="text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 p-1 rounded-full"><X size={16} /></button>
            </div>

            {trips.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">กรุณาสร้างทริปอย่างน้อยหนึ่งทริป เพื่อทำการแชร์แบ่งจ่าย</p>
            ) : (
              <form onSubmit={handleSaveShared} className="space-y-3 pt-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">หัวข้อรายการที่จ่ายไป *</label>
                  <input 
                    type="text" 
                    value={sharedForm.title}
                    onChange={(e) => setSharedForm({ ...sharedForm, title: e.target.value })}
                    placeholder="เช่น แก๊สกระป๋อง, อุปกรณ์เตาปิ้ง"
                    className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-zinc-400 mb-1">หมวดหมู่</label>
                    <select 
                      value={sharedForm.category}
                      onChange={(e) => setSharedForm({ ...sharedForm, category: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border outline-none cursor-pointer ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    >
                      <option value="อุปกรณ์">ค่าอุปกรณ์</option>
                      <option value="ค่าน้ำมัน">ค่าน้ำมันรถ</option>
                      <option value="ค่าอาหารเตรียม">ค่าอาหารเตรียม</option>
                      <option value="แก๊ส/ถ่าน">ค่าแก๊ส/ถ่าน</option>
                      <option value="ค่าใช้จ่ายจิปาถะ">ค่าใช้จ่ายจิปาถะ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-zinc-400 mb-1">จำนวนเงินจริง (บาท) *</label>
                    <input 
                      type="number" 
                      min="1"
                      value={sharedForm.amount}
                      onChange={(e) => setSharedForm({ ...sharedForm, amount: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-400 mb-1">ติ๊กเลือกทริปที่ต้องการร่วมหารยอดเงินนี้ *</label>
                  <div className="border rounded-lg p-2 max-h-32 overflow-y-auto dark:border-zinc-800 space-y-1">
                    {trips.map(trip => {
                      const isCheck = sharedForm.tripIds.includes(trip.id);
                      return (
                        <label key={trip.id} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-stone-50 dark:hover:bg-zinc-800">
                          <input 
                            type="checkbox"
                            checked={isCheck}
                            onChange={() => {
                              if (isCheck) {
                                setSharedForm({ ...sharedForm, tripIds: sharedForm.tripIds.filter(id => id !== trip.id) });
                              } else {
                                setSharedForm({ ...sharedForm, tripIds: [...sharedForm.tripIds, trip.id] });
                              }
                            }}
                          />
                          <span className="truncate">{trip.title} ({trip.province})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {sharedForm.amount && sharedForm.tripIds.length > 0 && (
                  <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-lg text-center font-bold">
                    เฉลี่ยตกทริปละ: ฿{(sharedForm.amount / sharedForm.tripIds.length).toFixed(0)} (จำนวนแชร์ {sharedForm.tripIds.length} ทริป)
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t dark:border-zinc-800">
                  <button type="button" onClick={() => setShowSharedModal(false)} className="w-1/2 py-2.5 rounded-lg border font-semibold">ยกเลิก</button>
                  <button type="submit" className="w-1/2 py-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-500 font-bold">บันทึกแชร์ส่วนกลาง</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT EXPENSE ================= */}
      {showDirectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-5 ${darkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-stone-200 text-zinc-800'}`}>
            <div className="flex justify-between items-center border-b pb-3 dark:border-zinc-800">
              <h3 className="font-extrabold text-sm text-emerald-500 flex items-center gap-1">
                <DollarSign size={16} /> บันทึกค่าใช้จ่ายเฉพาะทริป (Direct Trip Expense)
              </h3>
              <button onClick={() => setShowDirectModal(false)} className="text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 p-1 rounded-full"><X size={16} /></button>
            </div>

            {trips.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">กรุณาสร้างแผนทริปก่อน เพื่อเข้าใช้งานเมนูเฉพาะพื้นที่</p>
            ) : (
              <form onSubmit={handleSaveDirect} className="space-y-3 pt-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">เลือกทริปอ้างอิง *</label>
                  <select 
                    value={directForm.tripId}
                    onChange={(e) => setDirectForm({ ...directForm, tripId: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border cursor-pointer outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  >
                    <option value="" disabled>-- เลือกทริปการเดินทาง --</option>
                    {trips.map(trip => (
                      <option key={trip.id} value={trip.id}>{trip.title} ({trip.province})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-400 mb-1">หัวข้อค่าใช้จ่าย *</label>
                  <input 
                    type="text" 
                    value={directForm.title}
                    onChange={(e) => setDirectForm({ ...directForm, title: e.target.value })}
                    placeholder="เช่น ค่ากางเต็นท์, ค่าเช่าตะเกียง"
                    className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setDirectForm({ ...directForm, type: 'calculated' })}
                    className={`py-2 rounded-lg font-bold border ${directForm.type === 'calculated' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : ''}`}
                  >
                    คิดตามหัว (คน x คืน)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDirectForm({ ...directForm, type: 'flat' })}
                    className={`py-2 rounded-lg font-bold border ${directForm.type === 'flat' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : ''}`}
                  >
                    จ่ายเหมาจ่าย
                  </button>
                </div>

                {directForm.type === 'calculated' ? (
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-stone-100 dark:bg-zinc-800 rounded-lg">
                    <div>
                      <label className="block text-[10px] text-zinc-400 font-bold mb-1">จำนวนคน</label>
                      <input 
                        type="number" 
                        min="1"
                        value={directForm.peopleCount}
                        onChange={(e) => setDirectForm({ ...directForm, peopleCount: Number(e.target.value) })}
                        className={`w-full p-1.5 rounded border ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-stone-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 font-bold mb-1">จำนวนคืน</label>
                      <input 
                        type="number" 
                        min="1"
                        value={directForm.nightCount}
                        onChange={(e) => setDirectForm({ ...directForm, nightCount: Number(e.target.value) })}
                        className={`w-full p-1.5 rounded border ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-stone-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 font-bold mb-1">ราคาต่อคน/คืน</label>
                      <input 
                        type="number" 
                        min="0"
                        value={directForm.pricePerPersonNight}
                        onChange={(e) => setDirectForm({ ...directForm, pricePerPersonNight: Number(e.target.value) })}
                        className={`w-full p-1.5 rounded border ${darkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-stone-200'}`}
                        required={directForm.type === 'calculated'}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-zinc-400 mb-1">ระบุจำนวนเงินจ่ายเหมา (บาท) *</label>
                    <input 
                      type="number" 
                      min="1"
                      value={directForm.amount}
                      onChange={(e) => setDirectForm({ ...directForm, amount: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border outline-none ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                      required={directForm.type === 'flat'}
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-zinc-400 mb-1">รูปใบเสร็จแนบ (URL หรืออัปโหลดไฟล์)</label>
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      value={directForm.receiptImage}
                      onChange={(e) => setDirectForm({ ...directForm, receiptImage: e.target.value })}
                      placeholder="วาง URL ใบเสร็จประกอบ"
                      className={`w-full p-2.5 rounded-lg border outline-none flex-1 ${darkMode ? 'bg-zinc-800 border-zinc-755 text-white' : 'bg-stone-50 border-stone-200'}`}
                    />
                    <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg cursor-pointer flex items-center justify-center shrink-0">
                      <Camera size={15} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageToBase64(e, (b64) => setDirectForm({ ...directForm, receiptImage: b64 }))} 
                      />
                    </label>
                  </div>
                </div>

                {directForm.type === 'calculated' && directForm.pricePerPersonNight && (
                  <div className="bg-emerald-500/10 text-emerald-500 p-2 text-center rounded-lg font-bold">
                    คำนวณราคารวม: ฿{(Number(directForm.peopleCount || 1) * Number(directForm.nightCount || 1) * Number(directForm.pricePerPersonNight || 0)).toLocaleString()}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t dark:border-zinc-800">
                  <button type="button" onClick={() => setShowDirectModal(false)} className="w-1/2 py-2.5 rounded-lg border font-semibold">ยกเลิก</button>
                  <button type="submit" className="w-1/2 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold">บันทึกค่าใช้จ่ายตรง</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= BOTTOM ACTION BAR FOR MOBILE / TABLET RESPONSIVE ================= */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t py-2 px-3 flex justify-around items-center transition-colors shadow-lg ${darkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-stone-200'}`}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'dashboard' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <Grid size={18} />
          <span className="text-[9px] font-medium">ภาพรวม</span>
        </button>

        <button 
          onClick={() => setActiveTab('trips')} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'trips' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <Compass size={18} />
          <span className="text-[9px] font-medium">ทริปแคมป์</span>
        </button>

        <button 
          onClick={() => setActiveTab('expenses')} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'expenses' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <DollarSign size={18} />
          <span className="text-[9px] font-medium">ค่าใช้จ่าย</span>
        </button>

        <button 
          onClick={() => setActiveTab('food')} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'food' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <Utensils size={18} />
          <span className="text-[9px] font-medium">สเบียง</span>
        </button>

        <button 
          onClick={() => setActiveTab('stats')} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'stats' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <BarChart3 size={18} />
          <span className="text-[9px] font-medium">วิเคราะห์</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'settings' ? 'text-emerald-500 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'}`}
        >
          <Settings size={18} />
          <span className="text-[9px] font-medium">เครื่องมือ</span>
        </button>
      </nav>

    </div>
  );
}
