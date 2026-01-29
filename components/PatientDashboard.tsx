import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutGrid, 
  Stethoscope, 
  TestTube, 
  Pill, 
  FileText, 
  BrainCircuit, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Mic, 
  Bell, 
  FlaskConical, 
  Video,
  MessageCircle,
  Thermometer,
  Snowflake,
  Smile,
  Zap,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Download,
  FileCheck,
  Bone,
  Eye,
  Heart,
  Send,
  Star,
  Filter,
  Check,
  CreditCard,
  Receipt,
  Navigation,
  ChevronRight,
  Phone,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Info,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Package,
  Image as ImageIcon,
  File
} from 'lucide-react';

interface PatientDashboardProps {
  onLogout: () => void;
}

// --- MOCK DATA ---

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  experience: string;
  image: string;
  nextAvailable: string;
  price: number;
  location: string;
  distance: string;
  travelTime: string;
}

const ALL_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Anjali Desai', specialty: 'General Physician', hospital: 'Apollo Hospital', rating: 4.8, reviews: 124, experience: '12 Years', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop', nextAvailable: 'Today, 4:00 PM', price: 800, location: 'Indiranagar, Bangalore', distance: '2.4 km', travelTime: '12 mins' },
  { id: 'd2', name: 'Dr. Robert Smith', specialty: 'General Physician', hospital: 'City Clinic', rating: 4.6, reviews: 89, experience: '8 Years', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop', nextAvailable: 'Tomorrow, 10:00 AM', price: 600, location: 'Koramangala, Bangalore', distance: '5.1 km', travelTime: '25 mins' },
  { id: 'd3', name: 'Dr. Susan Lee', specialty: 'Dentist', hospital: 'Smile Care', rating: 4.9, reviews: 210, experience: '15 Years', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop', nextAvailable: 'Today, 2:30 PM', price: 1200, location: 'Whitefield, Bangalore', distance: '12 km', travelTime: '45 mins' },
  { id: 'd4', name: 'Dr. James Wilson', specialty: 'Cardiologist', hospital: 'Heart Institute', rating: 5.0, reviews: 305, experience: '20 Years', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop', nextAvailable: 'Fri, 11:00 AM', price: 2500, location: 'Hebbal, Bangalore', distance: '8.5 km', travelTime: '35 mins' },
  { id: 'd5', name: 'Dr. Emily Chen', specialty: 'Neurologist', hospital: 'Neuro Care', rating: 4.8, reviews: 150, experience: '14 Years', image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=2052&auto=format&fit=crop', nextAvailable: 'Mon, 09:00 AM', price: 2000, location: 'Jayanagar, Bangalore', distance: '6.2 km', travelTime: '28 mins' },
  { id: 'd6', name: 'Dr. Michael Ross', specialty: 'Orthopedist', hospital: 'Ortho Plus', rating: 4.7, reviews: 98, experience: '10 Years', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop', nextAvailable: 'Wed, 03:15 PM', price: 1500, location: 'MG Road, Bangalore', distance: '3.0 km', travelTime: '15 mins' },
];

const MOCK_DOCTORS: Record<string, Doctor[]> = {
  'General Physician': ALL_DOCTORS.filter(d => d.specialty === 'General Physician'),
  'Dentist': ALL_DOCTORS.filter(d => d.specialty === 'Dentist'),
  'Cardiologist': ALL_DOCTORS.filter(d => d.specialty === 'Cardiologist'),
  'Neurologist': ALL_DOCTORS.filter(d => d.specialty === 'Neurologist'),
};

const SYMPTOMS_LIST = [
  { id: 'fever', label: 'Fever', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-50', category: 'General Physician' },
  { id: 'cold', label: 'Cold/Flu', icon: Snowflake, color: 'text-sky-500', bg: 'bg-sky-50', category: 'General Physician' },
  { id: 'stomach', label: 'Stomach', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', category: 'General Physician' },
  { id: 'headache', label: 'Headache', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-50', category: 'Neurologist' },
  { id: 'dental', label: 'Dental', icon: Smile, color: 'text-teal-500', bg: 'bg-teal-50', category: 'Dentist' },
  { id: 'eye', label: 'Eye Issue', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50', category: 'Ophthalmologist' },
  { id: 'joint', label: 'Joint Pain', icon: Bone, color: 'text-slate-500', bg: 'bg-slate-100', category: 'Orthopedist' },
  { id: 'heart', label: 'Heart Burn', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', category: 'Cardiologist' },
];

const SPECIALTY_FILTERS = ['All', 'General Physician', 'Dentist', 'Cardiologist', 'Neurologist', 'Orthopedist', 'Ophthalmologist'];

// --- LAB TESTS MOCK DATA ---
interface LabTest {
  id: string;
  title: string;
  type: 'Package' | 'Test';
  testCount: number;
  tags?: string[];
  price: number;
  originalPrice: number;
  discount: number;
  tat: string; // Turn Around Time
  category: string;
  image: string;
  description: string;
  testsIncluded: string[];
  preparation: string[];
  location: string;
}

const LAB_TESTS: LabTest[] = [
  { 
    id: 'lt1', 
    title: 'Apollo Superior Full Body Checkup', 
    type: 'Package', 
    testCount: 89, 
    tags: ['Includes FREE Vitamin D Test'], 
    price: 3249, 
    originalPrice: 9283, 
    discount: 65, 
    tat: '24 hrs', 
    category: 'Full Body', 
    image: 'https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=800',
    description: 'A comprehensive health checkup designed to screen for common health conditions. Ideal for adults aged 25+ years for early detection and prevention of lifestyle diseases.',
    testsIncluded: ['Complete Blood Count (CBC)', 'Diabetes Screen (HbA1c, Fasting Glucose)', 'Liver Function Test (LFT)', 'Lipid Profile', 'Thyroid Profile (T3, T4, TSH)', 'Kidney Function Test (KFT)', 'Vitamin D Total', 'Vitamin B12', 'Iron Studies', 'Urine Routine'],
    preparation: ['Fasting of 10-12 hours is strictly required.', 'Drink water to stay hydrated.', 'Do not take morning medications before sample collection unless advised by your doctor.'],
    location: 'Apollo Diagnostics, Indiranagar, Bangalore'
  },
  { 
    id: 'lt2', 
    title: 'Apollo Full Body Checkup - Essential', 
    type: 'Package', 
    testCount: 56, 
    tags: ['Eligible for 100% Money Back'], 
    price: 1479, 
    originalPrice: 3697, 
    discount: 60, 
    tat: '24 hrs', 
    category: 'Full Body', 
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    description: 'Essential health screening covering vital body functions. Recommended annually for checking general health status.',
    testsIncluded: ['Complete Haemogram', 'Fasting Blood Sugar', 'Lipid Profile', 'Liver Function Test (Basic)', 'Kidney Function Test (Basic)', 'TSH'],
    preparation: ['Fasting of 8-10 hours required.', 'Avoid alcohol 24 hours prior to the test.'],
    location: 'Apollo Diagnostics, Koramangala, Bangalore'
  },
  { 
    id: 'lt3', 
    title: 'Comprehensive Gold Full Body Checkup', 
    type: 'Package', 
    testCount: 71, 
    tags: ['Popular'], 
    price: 2249, 
    originalPrice: 5623, 
    discount: 60, 
    tat: '18 hrs', 
    category: 'Full Body', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    description: 'An extensive package that covers all major organs and vital nutrients. Suitable for individuals with a family history of diabetes or heart disease.',
    testsIncluded: ['CBC with ESR', 'Diabetes Screening', 'Lipid Profile Extended', 'Liver Function Test Complete', 'Renal Function Test', 'Thyroid Profile', 'Calcium', 'Uric Acid'],
    preparation: ['10-12 hours fasting required.', 'Morning sample collection preferred.'],
    location: 'MediCare Labs, Whitefield, Bangalore'
  },
  { 
    id: 'lt4', 
    title: 'Thyroid Profile (T3, T4, TSH)', 
    type: 'Test', 
    testCount: 3, 
    price: 499, 
    originalPrice: 1000, 
    discount: 50, 
    tat: '6 hrs', 
    category: 'Thyroid', 
    image: 'https://images.unsplash.com/photo-1606618779553-9562433f014e?auto=format&fit=crop&q=80&w=800',
    description: 'Measures the level of thyroid hormones in your blood to check the function of your thyroid gland.',
    testsIncluded: ['Triiodothyronine (T3)', 'Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'],
    preparation: ['No fasting required.', 'Sample can be given at any time of the day.'],
    location: 'Thyrocare, Jayanagar, Bangalore'
  },
  { 
    id: 'lt5', 
    title: 'Lipid Profile Test', 
    type: 'Test', 
    testCount: 8, 
    tags: ['Fasting Required'], 
    price: 829, 
    originalPrice: 2072, 
    discount: 60, 
    tat: '8 hrs', 
    category: 'Heart', 
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800',
    description: 'A complete cholesterol test to assess the risk of heart disease.',
    testsIncluded: ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'VLDL Cholesterol', 'Triglycerides', 'Total/HDL Ratio'],
    preparation: ['10-12 hours fasting is mandatory.', 'Plain water is allowed.'],
    location: 'Orange Health Labs, HSR Layout, Bangalore'
  },
  { 
    id: 'lt6', 
    title: 'CBC Test (Complete Blood Count)', 
    type: 'Test', 
    testCount: 30, 
    price: 419, 
    originalPrice: 1047, 
    discount: 60, 
    tat: '4 hrs', 
    category: 'Blood Studies', 
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
    description: 'Evaluates overall health and detects a wide range of disorders, including anemia, infection and leukemia.',
    testsIncluded: ['Hemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count', 'MCV, MCH, MCHC', 'Differential Count'],
    preparation: ['No fasting required.'],
    location: 'Dr. Lal PathLabs, MG Road, Bangalore'
  },
  { 
    id: 'lt7', 
    title: 'HbA1c Test (Hemoglobin A1c)', 
    type: 'Test', 
    testCount: 3, 
    price: 649, 
    originalPrice: 1623, 
    discount: 60, 
    tat: '6 hrs', 
    category: 'Diabetes', 
    image: 'https://images.unsplash.com/photo-1576091160550-21871bf2300b?auto=format&fit=crop&q=80&w=800',
    description: 'Average blood sugar levels over the past 3 months. Gold standard for monitoring diabetes control.',
    testsIncluded: ['HbA1c', 'Average Blood Glucose'],
    preparation: ['No fasting required.'],
    location: 'Metropolis Healthcare, Banashankari, Bangalore'
  },
  { 
    id: 'lt8', 
    title: 'Liver Function Test (LFT)', 
    type: 'Test', 
    testCount: 11, 
    price: 800, 
    originalPrice: 1600, 
    discount: 50, 
    tat: '12 hrs', 
    category: 'Liver', 
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
    description: 'Screening test to check liver health and detect liver damage.',
    testsIncluded: ['Bilirubin (Total, Direct, Indirect)', 'SGOT (AST)', 'SGPT (ALT)', 'Alkaline Phosphatase', 'Total Protein', 'Albumin', 'Globulin'],
    preparation: ['No fasting required, but avoid heavy meals before test.'],
    location: 'Aster Labs, Hebbal, Bangalore'
  },
  { 
    id: 'lt9', 
    title: 'Kidney Function Test (KFT)', 
    type: 'Test', 
    testCount: 9, 
    price: 950, 
    originalPrice: 1900, 
    discount: 50, 
    tat: '12 hrs', 
    category: 'Kidney', 
    image: 'https://images.unsplash.com/photo-1559757175-7b2713a6b527?auto=format&fit=crop&q=80&w=800',
    description: 'Evaluates how well the kidneys are working.',
    testsIncluded: ['Blood Urea Nitrogen', 'Serum Creatinine', 'Uric Acid', 'Calcium', 'Sodium', 'Potassium', 'Chloride'],
    preparation: ['No specific preparation required.'],
    location: 'Suburban Diagnostics, Malleshwaram, Bangalore'
  },
];

const LAB_CATEGORIES = ['All', 'Full Body', 'Diabetes', 'Heart', 'Thyroid', 'Blood Studies', 'Women\'s Health', 'Senior Citizen'];

// --- PHARMACY MOCK DATA ---
interface Medicine {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
  manufacturer: string;
  dosage: string;
  packSize: string;
  description: string;
}

const MEDICINES: Medicine[] = [
  { id: 'med1', name: 'Dolo 650mg', type: 'Tablet', price: 30, originalPrice: 40, discount: 25, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800', category: 'Tablets', manufacturer: 'Micro Labs Ltd', dosage: '650mg', packSize: '15 Tablets', description: 'Used for fever and mild to moderate pain relief.' },
  { id: 'med2', name: 'Benadryl Cough Syrup', type: 'Syrup', price: 110, originalPrice: 125, discount: 12, image: 'https://images.unsplash.com/photo-1603555501671-3f938d01f92e?auto=format&fit=crop&q=80&w=800', category: 'Syrups', manufacturer: 'Johnson & Johnson', dosage: '150ml', packSize: '1 Bottle', description: 'Relieves cough, congestion, and throat irritation.' },
  { id: 'med3', name: 'Volini Gel', type: 'Ointment', price: 145, originalPrice: 160, discount: 9, image: 'https://images.unsplash.com/photo-1626968037373-c4eb9d042299?auto=format&fit=crop&q=80&w=800', category: 'Creams & Ointments', manufacturer: 'Sun Pharma', dosage: '30g', packSize: '1 Tube', description: 'Pain relief gel for joint, back, neck, and shoulder pain.' },
  { id: 'med4', name: 'Seven Seas Cod Liver Oil', type: 'Capsule', price: 320, originalPrice: 400, discount: 20, image: 'https://images.unsplash.com/photo-1550572017-ed108bc2773d?auto=format&fit=crop&q=80&w=800', category: 'Supplements', manufacturer: 'Merck', dosage: '300mg', packSize: '100 Capsules', description: 'Rich source of Omega-3 and Vitamin D for heart and immunity.' },
  { id: 'med5', name: 'Dettol Antiseptic', type: 'Liquid', price: 180, originalPrice: 200, discount: 10, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800', category: 'First Aid', manufacturer: 'Reckitt', dosage: '500ml', packSize: '1 Bottle', description: 'Disinfectant liquid for first aid and surface cleaning.' },
  { id: 'med6', name: 'Refresh Tears', type: 'Drops', price: 480, originalPrice: 550, discount: 12, image: 'https://images.unsplash.com/photo-1588625902096-747209930605?auto=format&fit=crop&q=80&w=800', category: 'Eye Drops', manufacturer: 'Allergan', dosage: '10ml', packSize: '1 Bottle', description: 'Lubricant eye drops for dry and irritated eyes.' },
  { id: 'med7', name: 'Hansaplast Bandage', type: 'Bandage', price: 50, originalPrice: 60, discount: 16, image: 'https://images.unsplash.com/photo-1599407333919-61994e773703?auto=format&fit=crop&q=80&w=800', category: 'First Aid', manufacturer: 'Beiersdorf', dosage: 'Standard', packSize: '20 Strips', description: 'Waterproof antiseptic bandages for minor cuts and wounds.' },
  { id: 'med8', name: 'Otrivin Nasal Drops', type: 'Drops', price: 65, originalPrice: 75, discount: 13, image: 'https://images.unsplash.com/photo-1631549916768-4119b2d3f9e2?auto=format&fit=crop&q=80&w=800', category: 'Ear & Nasal Drops', manufacturer: 'GSK', dosage: '10ml', packSize: '1 Bottle', description: 'Relieves blocked nose due to cold and sinusitis.' },
  { id: 'med9', name: 'Shelcal 500', type: 'Tablet', price: 120, originalPrice: 140, discount: 14, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800', category: 'Supplements', manufacturer: 'Torrent Pharma', dosage: '500mg', packSize: '15 Tablets', description: 'Calcium supplement with Vitamin D3 for bone health.' },
];

// --- HEALTH REPORTS MOCK DATA ---
interface HealthReport {
  id: string;
  title: string;
  type: 'Lab Report' | 'Prescription' | 'Medical Report';
  date: string;
  doctorOrLab: string;
  fileType: 'PDF' | 'JPG';
  fileSize: string;
}

const HEALTH_REPORTS: HealthReport[] = [
  { id: 'r1', title: 'Complete Blood Count (CBC)', type: 'Lab Report', date: '28 Jan, 2024', doctorOrLab: 'Apollo Diagnostics', fileType: 'PDF', fileSize: '1.2 MB' },
  { id: 'r2', title: 'General Viral Fever Prescription', type: 'Prescription', date: '25 Jan, 2024', doctorOrLab: 'Dr. Robert Smith', fileType: 'PDF', fileSize: '450 KB' },
  { id: 'r3', title: 'Chest X-Ray PA View', type: 'Medical Report', date: '10 Dec, 2023', doctorOrLab: 'City Imaging Center', fileType: 'JPG', fileSize: '3.5 MB' },
  { id: 'r4', title: 'Lipid Profile Test', type: 'Lab Report', date: '15 Nov, 2023', doctorOrLab: 'Orange Health Labs', fileType: 'PDF', fileSize: '1.8 MB' },
  { id: 'r5', title: 'Dental Root Canal Plan', type: 'Prescription', date: '05 Nov, 2023', doctorOrLab: 'Dr. Susan Lee', fileType: 'PDF', fileSize: '800 KB' },
  { id: 'r6', title: 'MRI Scan - Knee', type: 'Medical Report', date: '20 Oct, 2023', doctorOrLab: 'City Imaging Center', fileType: 'JPG', fileSize: '12 MB' },
  { id: 'r7', title: 'Thyroid Function Test', type: 'Lab Report', date: '12 Oct, 2023', doctorOrLab: 'Thyrocare', fileType: 'PDF', fileSize: '1.5 MB' },
  { id: 'r8', title: 'Follow-up Prescription', type: 'Prescription', date: '30 Sep, 2023', doctorOrLab: 'Dr. Emily Chen', fileType: 'PDF', fileSize: '320 KB' },
];

const REPORT_FILTERS = ['All', 'Lab Report', 'Prescription', 'Medical Report'];

// --- TYPES ---
interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  type: 'text' | 'doctor-recommendation';
  doctors?: Doctor[];
  categoryRecommended?: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  type: 'video' | 'clinic';
  status: 'Upcoming' | 'Completed';
  travelTime?: string; // Only for clinic
}

interface PaymentReceipt {
  transactionId: string;
  date: string;
  doctorName: string;
  amount: number;
  status: 'Success';
  description: string;
}

interface Interaction {
  id: string;
  doctorName: string;
  doctorImage: string;
  date: string;
  type: 'Chat' | 'Video Call';
  summary: string;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewAllSymptomsOpen, setViewAllSymptomsOpen] = useState(false);
  
  // Data States
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([
    { 
      id: 'apt_001', 
      doctorId: 'd1', 
      doctorName: 'Dr. Sarah Mitchell', 
      doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop', 
      specialty: 'Geneticist', 
      hospital: 'Apollo Hospital', 
      date: 'Today', 
      time: '10:00 AM', 
      type: 'video', 
      status: 'Upcoming' 
    }
  ]);

  const [paymentHistory, setPaymentHistory] = useState<PaymentReceipt[]>([
    { transactionId: 'TXN_123456', date: 'Jan 28, 2024', doctorName: 'Dr. James Wilson', amount: 2500, status: 'Success', description: 'Video Consultation' }
  ]);

  const [recentInteractions] = useState<Interaction[]>([
    { id: 'int_1', doctorName: 'Dr. Robert Smith', doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop', date: 'Yesterday', type: 'Chat', summary: 'Follow up on fever symptoms' },
    { id: 'int_2', doctorName: 'Dr. Susan Lee', doctorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop', date: '25 Jan, 2024', type: 'Video Call', summary: 'Dental checkup consultation' },
  ]);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('Today');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingType, setBookingType] = useState<'video' | 'clinic'>('video');
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'success'>('details');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Doctor Filter State
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Lab Tests State
  const [selectedLabCategory, setSelectedLabCategory] = useState('All');
  const [cart, setCart] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [labBookingStep, setLabBookingStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [isProcessingLabPayment, setIsProcessingLabPayment] = useState(false);
  const [viewLabTest, setViewLabTest] = useState<LabTest | null>(null);

  // Pharmacy State
  const [pharmacyCart, setPharmacyCart] = useState<string[]>([]);
  const [pharmacyBookingStep, setPharmacyBookingStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [isProcessingPharmaPayment, setIsProcessingPharmaPayment] = useState(false);
  const [viewMedicine, setViewMedicine] = useState<Medicine | null>(null);

  // Reports State
  const [reportFilter, setReportFilter] = useState('All');
  const [viewingReport, setViewingReport] = useState<HealthReport | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, isChatOpen]);

  const sidebarItems = [
    { id: 'overview', icon: LayoutGrid, label: 'Overview' },
    { id: 'book-doctor', icon: Stethoscope, label: 'Book Doctor' },
    { id: 'lab-tests', icon: FlaskConical, label: 'Lab Tests', badge: 'Offer' },
    { id: 'pharmacy', icon: ShoppingBag, label: 'Pharmacy' },
    { id: 'payments', icon: CreditCard, label: 'Payments & Receipts' },
    { id: 'reports', icon: FileText, label: 'Health Reports' },
  ];

  const specialties = [
    { label: 'Cardiology', icon: Heart, doctors: 12 },
    { label: 'Dentistry', icon: Smile, doctors: 8 },
    { label: 'Orthopedics', icon: Bone, doctors: 5 },
    { label: 'Neurology', icon: BrainCircuit, doctors: 7 },
    { label: 'Ophthalmology', icon: Eye, doctors: 4 },
    { label: 'General', icon: Stethoscope, doctors: 15 },
  ];

  // --- FILTERED DOCTORS ---
  const filteredDoctors = ALL_DOCTORS.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  // --- FILTERED LAB TESTS ---
  const filteredLabTests = LAB_TESTS.filter(test => {
      const matchesCategory = selectedLabCategory === 'All' || test.category === selectedLabCategory;
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  // --- FILTERED MEDICINES ---
  const filteredMedicines = MEDICINES.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
  });

  // --- FILTERED REPORTS ---
  const filteredReports = HEALTH_REPORTS.filter(report => {
      const matchesFilter = reportFilter === 'All' || report.type === reportFilter;
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            report.doctorOrLab.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
  });

  // --- CART LOGIC ---
  const toggleCartItem = (id: string) => {
      setCart(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const getCartTotal = () => {
      return cart.reduce((total, id) => {
          const test = LAB_TESTS.find(t => t.id === id);
          return total + (test?.price || 0);
      }, 0);
  };

  const togglePharmacyCartItem = (id: string) => {
      setPharmacyCart(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const getPharmacyCartTotal = () => {
      return pharmacyCart.reduce((total, id) => {
          const med = MEDICINES.find(m => m.id === id);
          return total + (med?.price || 0);
      }, 0);
  };

  const handleOpenCart = () => {
      if (activeTab === 'pharmacy') {
          setPharmacyBookingStep('cart');
      } else {
          setLabBookingStep('cart');
      }
      setIsCartOpen(true);
  };

  const handleLabCheckout = () => {
      setLabBookingStep('payment');
  };

  const handlePharmacyCheckout = () => {
      setPharmacyBookingStep('shipping');
  };

  const handlePharmacyShipping = () => {
      setPharmacyBookingStep('payment');
  }

  const handleConfirmLabPayment = () => {
      setIsProcessingLabPayment(true);
      setTimeout(() => {
          setIsProcessingLabPayment(false);
          setLabBookingStep('success');
          
          // Generate Receipt for Lab Order
          const totalAmount = getCartTotal();
          const newReceipt: PaymentReceipt = {
              transactionId: `LAB_${Math.floor(Math.random() * 1000000)}`,
              date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              doctorName: 'MediConnect Labs',
              amount: totalAmount,
              status: 'Success',
              description: `Lab Order: ${cart.length} Tests`
          };
          setPaymentHistory(prev => [newReceipt, ...prev]);

      }, 2000);
  };

  const handleConfirmPharmacyPayment = () => {
      setIsProcessingPharmaPayment(true);
      setTimeout(() => {
          setIsProcessingPharmaPayment(false);
          setPharmacyBookingStep('success');
          
          const totalAmount = getPharmacyCartTotal();
          const newReceipt: PaymentReceipt = {
              transactionId: `PHR_${Math.floor(Math.random() * 1000000)}`,
              date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              doctorName: 'MediConnect Pharmacy',
              amount: totalAmount,
              status: 'Success',
              description: `Pharmacy Order: ${pharmacyCart.length} Items`
          };
          setPaymentHistory(prev => [newReceipt, ...prev]);

      }, 2000);
  };

  const handleLabOrderComplete = () => {
      setCart([]);
      setIsCartOpen(false);
      setLabBookingStep('cart');
      setActiveTab('payments');
  };

  const handlePharmacyOrderComplete = () => {
      setPharmacyCart([]);
      setIsCartOpen(false);
      setPharmacyBookingStep('cart');
      setActiveTab('payments');
  }

  const handleViewLabTest = (test: LabTest) => {
    setViewLabTest(test);
  };

  const handleViewMedicine = (med: Medicine) => {
      setViewMedicine(med);
  }

  const closeLabTestModal = () => {
    setViewLabTest(null);
  };

  const closeMedicineModal = () => {
      setViewMedicine(null);
  }

  const handleViewReport = (report: HealthReport) => {
      setViewingReport(report);
  };

  const closeReportModal = () => {
      setViewingReport(null);
  };

  // --- CHAT LOGIC ---

  const handleSymptomClick = (symptom: typeof SYMPTOMS_LIST[0]) => {
    setViewAllSymptomsOpen(false); 
    setIsChatOpen(true);
    setChatMessages([]); 
    setIsTyping(true);

    setTimeout(() => {
      setChatMessages([
        {
          id: '1',
          sender: 'bot',
          type: 'text',
          text: `I noticed you selected ${symptom.label}. I'm here to help. To give you the best advice, could you tell me how long you've been feeling this way and if you have any other symptoms?`
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      text: inputValue
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        type: 'text',
        text: "Thanks for sharing. Based on your symptoms, it looks like a mild infection, but it's best to get a professional opinion. I recommend consulting a specialist."
      };

      const doctorRecMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        type: 'doctor-recommendation',
        doctors: MOCK_DOCTORS['General Physician'] || ALL_DOCTORS.slice(0, 2), 
        categoryRecommended: 'General Physician'
      };

      setChatMessages(prev => [...prev, responseMsg, doctorRecMsg]);
      setIsTyping(false);
    }, 2000);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    if (chatMessages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setChatMessages([{
          id: '1',
          sender: 'bot',
          type: 'text',
          text: "Hello Daniel! I'm your AI Health Assistant. How are you feeling today?"
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // --- BOOKING LOGIC ---
  const openBookingModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingDate('Today');
    setBookingTime('');
    setBookingType('video');
    setBookingStep('details');
  };

  const handleProceedToPayment = () => {
    setBookingStep('payment');
  };

  const handleConfirmPayment = () => {
    if (!selectedDoctor) return;
    setIsProcessingPayment(true);
    
    // Simulate Payment Gateway
    setTimeout(() => {
        setIsProcessingPayment(false);
        setBookingStep('success');

        // 1. Add Appointment
        const newAppointment: Appointment = {
            id: `apt_${Date.now()}`,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            doctorImage: selectedDoctor.image,
            specialty: selectedDoctor.specialty,
            hospital: selectedDoctor.hospital,
            date: bookingDate,
            time: bookingTime,
            type: bookingType,
            status: 'Upcoming',
            travelTime: bookingType === 'clinic' ? selectedDoctor.travelTime : undefined
        };
        setMyAppointments(prev => [newAppointment, ...prev]);

        // 2. Generate Receipt
        const newReceipt: PaymentReceipt = {
            transactionId: `TXN_${Math.floor(Math.random() * 1000000)}`,
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            doctorName: selectedDoctor.name,
            amount: selectedDoctor.price,
            status: 'Success',
            description: bookingType === 'video' ? 'Video Consultation' : 'In-Clinic Consultation'
        };
        setPaymentHistory(prev => [newReceipt, ...prev]);

    }, 2500);
  };

  const closeBookingModal = () => {
      setSelectedDoctor(null);
      setBookingStep('details');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex overflow-hidden">
      
      {/* DESKTOP SIDEBAR (Fixed 260px) */}
      <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 bg-white/80 backdrop-blur-xl border-r border-slate-100 z-40">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Activity size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                MediConnect
              </span>
              <span className="text-xs font-medium text-brand-600 tracking-wider uppercase">Medical</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-brand-50 text-brand-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-brand-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2 group-hover:stroke-[2.5px]'} />
                {item.label}
              </div>
              {item.badge && (
                <span className="bg-brand-100 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-gradient-to-br from-brand-50 to-white p-3 rounded-2xl border border-brand-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-bold text-slate-900 truncate">Daniel Bruk</p>
                 <p className="text-xs text-brand-500 truncate">Premium Member</p>
              </div>
              <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                 <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center">
              <Activity size={18} />
            </div>
            <span className="font-bold text-slate-900">MediConnect</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-20 px-6 animate-fade-in">
           <nav className="space-y-4">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-medium ${
                    activeTab === item.id ? 'bg-brand-50 text-brand-600' : 'text-slate-500'
                  }`}
                >
                  <item.icon size={24} />
                  {item.label}
                </button>
              ))}
              <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-medium text-red-500 mt-8 bg-red-50">
                  <LogOut size={24} /> Logout
              </button>
           </nav>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:pl-[260px] w-full relative">
        <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
          
          {/* HEADER SECTION (Greeting & Search) */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sticky top-0 z-30 bg-slate-50/95 backdrop-blur-sm py-2">
             <div className="animate-fade-in-down">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {activeTab === 'overview' ? 'Good Morning, Daniel' : 
                     activeTab === 'book-doctor' ? 'Book a Doctor' : 
                     activeTab === 'lab-tests' ? 'Lab Tests & Packages' :
                     activeTab === 'pharmacy' ? 'Pharmacy' :
                     activeTab === 'reports' ? 'Health Reports' :
                     activeTab === 'payments' ? 'Payments & Receipts' : 'Dashboard'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    {activeTab === 'overview' ? 'Here is your daily health intelligence summary.' : 
                     activeTab === 'lab-tests' ? 'Book health checkups from top certified labs.' : 
                     activeTab === 'pharmacy' ? 'Order medicines and healthcare products.' : 
                     activeTab === 'reports' ? 'Access your medical records and prescriptions securely.' : 'Manage your health journey.'}
                </p>
             </div>

             <div className="flex items-center gap-4 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
                <div className="relative hidden md:block group">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                   <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={activeTab === 'pharmacy' ? "Search medicines, syrup..." : activeTab === 'reports' ? "Search records, doctors..." : "Search doctors..."} 
                      className="pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all w-64 shadow-sm"
                   />
                   <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded-full text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                      <Mic size={12} />
                   </button>
                </div>
                <button className="relative w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all shadow-sm">
                   <Bell size={18} />
                   <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                {/* Cart Icon (Lab Tests & Pharmacy) */}
                {(activeTab === 'lab-tests' || activeTab === 'pharmacy') && (
                    <button 
                        onClick={handleOpenCart}
                        className="relative w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 transition-all shadow-md"
                    >
                        <ShoppingCart size={18} />
                        {(activeTab === 'pharmacy' ? pharmacyCart.length : cart.length) > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {activeTab === 'pharmacy' ? pharmacyCart.length : cart.length}
                            </span>
                        )}
                    </button>
                )}
             </div>
          </header>

          <div className="space-y-8 pb-20">
            
            {/* --- VIEW: OVERVIEW --- */}
            {activeTab === 'overview' && (
                <>
                    {/* 1. SYMPTOM QUICK CONNECT */}
                    <section className="animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Feeling unwell?</h3>
                        <span 
                        onClick={() => setViewAllSymptomsOpen(true)}
                        className="text-xs font-bold text-brand-600 cursor-pointer hover:underline"
                        >
                        View all symptoms
                        </span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {SYMPTOMS_LIST.slice(0, 5).map((symptom, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleSymptomClick(symptom)}
                            className="flex-shrink-0 flex items-center gap-3 bg-white p-3 pr-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
                        >
                            <div className={`w-10 h-10 rounded-xl ${symptom.bg} ${symptom.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <symptom.icon size={20} />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{symptom.label}</span>
                        </button>
                        ))}
                    </div>
                    </section>

                    {/* 2. UPCOMING SCHEDULE (DYNAMIC) */}
                    <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Upcoming Schedule</h3>
                        {myAppointments.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myAppointments.map((apt) => (
                                <div key={apt.id} className={`relative overflow-hidden rounded-[2rem] shadow-xl p-6 flex flex-col justify-between min-h-[220px] transition-all hover:scale-[1.01] ${apt.type === 'video' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20' : 'bg-white border border-slate-200 text-slate-900'}`}>
                                    {apt.type === 'video' && <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>}
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border ${apt.type === 'video' ? 'bg-white/20 backdrop-blur-md border-white/20' : 'bg-brand-50 text-brand-700 border-brand-100'}`}>
                                            {apt.type === 'video' ? <Video size={12} /> : <MapPin size={12} />} 
                                            {apt.type === 'video' ? 'Video Consultation' : 'In-Clinic Visit'}
                                            </div>
                                            <div className={`w-10 h-10 rounded-full border-2 overflow-hidden ${apt.type === 'video' ? 'border-white/30 bg-white/10' : 'border-slate-100'}`}>
                                            <img src={apt.doctorImage} alt="Doctor" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1">{apt.doctorName}</h3>
                                        <p className={`text-sm ${apt.type === 'video' ? 'text-indigo-100' : 'text-slate-500'}`}>{apt.specialty} • {apt.hospital}</p>
                                    </div>

                                    <div className={`relative z-10 mt-6 rounded-xl p-3 flex items-center justify-between ${apt.type === 'video' ? 'bg-black/10 backdrop-blur-sm' : 'bg-slate-50 border border-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${apt.type === 'video' ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                                            <Clock size={20} />
                                            </div>
                                            <div>
                                            <p className={`text-xs font-medium ${apt.type === 'video' ? 'text-indigo-200' : 'text-slate-400'}`}>{apt.date}</p>
                                            <p className={`font-bold ${apt.type === 'video' ? 'text-white' : 'text-slate-900'}`}>{apt.time}</p>
                                            </div>
                                        </div>
                                        {apt.type === 'video' ? (
                                            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-50 transition-colors">
                                                Join Call
                                            </button>
                                        ) : (
                                            <button className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1">
                                                <Navigation size={12} /> Directions
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center">
                                <p className="text-slate-500">No upcoming appointments.</p>
                                <button onClick={() => setActiveTab('book-doctor')} className="mt-4 text-brand-600 font-bold hover:underline">Book a consultation</button>
                            </div>
                        )}
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 3. RECENT INTERACTIONS (NEW) */}
                        <section className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Recent Interactions</h3>
                            </div>
                            <div className="space-y-4">
                                {recentInteractions.map((interaction) => (
                                    <div key={interaction.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:border-brand-200 transition-colors group">
                                        <img src={interaction.doctorImage} alt={interaction.doctorName} className="w-12 h-12 rounded-xl object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-slate-900 text-sm">{interaction.doctorName}</h4>
                                                <span className="text-xs text-slate-400">{interaction.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${interaction.type === 'Chat' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                    {interaction.type}
                                                </span>
                                                <p className="text-xs text-slate-500 truncate">{interaction.summary}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                                            <MessageCircle size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. SPECIALIST CATEGORIES */}
                        <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Book Specialist</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {specialties.map((spec, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => {
                                        setActiveTab('book-doctor');
                                        setSelectedSpecialty(spec.label === 'General' ? 'General Physician' : spec.label);
                                    }}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group text-center"
                                >
                                    <div className="w-10 h-10 mx-auto bg-slate-50 text-slate-600 rounded-full flex items-center justify-center mb-2 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                        <spec.icon size={20} />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-700">{spec.label}</h4>
                                    <p className="text-[10px] text-slate-400 mt-1">{spec.doctors} Doctors</p>
                                </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </>
            )}

            {/* --- VIEW: HEALTH REPORTS (NEW) --- */}
            {activeTab === 'reports' && (
                <div className="animate-fade-in">
                    {/* Filters */}
                    <div className="mb-8 overflow-x-auto pb-2 custom-scrollbar">
                        <div className="flex gap-3">
                            {REPORT_FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setReportFilter(filter)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                        reportFilter === filter 
                                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reports Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReports.map((report) => (
                            <div key={report.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all group cursor-pointer relative overflow-hidden flex flex-col justify-between">
                                {/* Decor Strip REMOVED */}

                                <div>
                                    <div className="flex justify-between items-start mb-4 pl-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                            report.type === 'Lab Report' ? 'bg-blue-50 text-blue-600' :
                                            report.type === 'Prescription' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                            {report.type === 'Lab Report' && <FlaskConical size={24} />}
                                            {report.type === 'Prescription' && <Pill size={24} />}
                                            {report.type === 'Medical Report' && <FileText size={24} />}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                            {report.fileType === 'PDF' ? <FileText size={12} className="text-red-500" /> : <ImageIcon size={12} className="text-blue-500" />}
                                            <span className="text-[10px] font-bold text-slate-500">{report.fileType}</span>
                                        </div>
                                    </div>

                                    <div className="pl-1 mb-4">
                                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-brand-600 transition-colors">{report.title}</h3>
                                        <p className="text-sm text-slate-500">{report.doctorOrLab}</p>
                                    </div>
                                </div>

                                <div className="pl-1 mt-2 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{report.date}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleViewReport(report)}
                                            className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-600 hover:text-white transition-colors"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                alert(`Downloading ${report.title}...`);
                                            }}
                                            className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredReports.length === 0 && (
                         <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <File size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No reports found</h3>
                            <p className="text-slate-500">Try changing the filter or search query.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- VIEW: PHARMACY (NEW) --- */}
            {activeTab === 'pharmacy' && (
                <div className="animate-fade-in">
                    
                    {/* Medicines Grid - Updated Layout to match Lab Tests (1col mobile, 2col md, 3col lg) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMedicines.map((med) => (
                            <div 
                                key={med.id} 
                                onClick={() => handleViewMedicine(med)}
                                className="bg-white rounded-3xl border border-slate-200 flex flex-col justify-between hover:shadow-xl hover:shadow-brand-900/5 transition-all group relative overflow-hidden cursor-pointer"
                            >
                                {/* Image Banner - Updated styling to match Lab Tests */}
                                <div className="h-40 overflow-hidden relative">
                                    {/* Using object-contain with a white background for medicines looks cleaner, but maintaining structure */}
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                        <img src={med.image} alt={med.name} className="h-32 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                                    
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border text-slate-700 bg-white/90 backdrop-blur-md border-slate-200 shadow-sm">
                                            {med.type}
                                        </span>
                                        {med.discount > 0 && (
                                            <span className="text-[10px] font-bold text-white flex items-center gap-1 bg-green-500 px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm">
                                                -{med.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{med.name}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{med.packSize} • {med.manufacturer}</p>

                                    <div className="mt-auto pt-4 border-t border-slate-50">
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className="text-2xl font-bold text-slate-900">₹{med.price}</span>
                                            <span className="text-sm text-slate-400 line-through mb-1">₹{med.originalPrice}</span>
                                        </div>

                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePharmacyCartItem(med.id);
                                            }}
                                            className={`w-full py-3 font-bold rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                                                pharmacyCart.includes(med.id) 
                                                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                                : 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20'
                                            }`}
                                        >
                                            {pharmacyCart.includes(med.id) ? (
                                                <><Trash2 size={16} /> Remove</>
                                            ) : (
                                                <><ShoppingCart size={16} /> Add To Cart</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredMedicines.length === 0 && (
                         <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                            <p className="text-slate-500">Try changing the search term.</p>
                        </div>
                    )}
                    
                    {/* CART FLOATING BAR */}
                    {pharmacyCart.length > 0 && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-[calc(50%+130px)] z-[60] w-full max-w-md px-4 animate-fade-in-up">
                            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{pharmacyCart.length} Items Selected</p>
                                    <p className="text-xl font-bold">₹{getPharmacyCartTotal()}</p>
                                </div>
                                <button 
                                    onClick={handleOpenCart}
                                    className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-brand-50 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    View Cart <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- VIEW: LAB TESTS (RESTORED & NEW UI) --- */}
            {activeTab === 'lab-tests' && (
                <div className="animate-fade-in">
                    {/* Categories Filter */}
                    <div className="mb-8 overflow-x-auto pb-2 custom-scrollbar">
                        <div className="flex gap-3">
                            {LAB_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedLabCategory(cat)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                        selectedLabCategory === cat 
                                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tests Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLabTests.map((test) => (
                            <div 
                                key={test.id} 
                                onClick={() => handleViewLabTest(test)}
                                className="bg-white rounded-3xl border border-slate-200 flex flex-col justify-between hover:shadow-xl hover:shadow-brand-900/5 transition-all group relative overflow-hidden cursor-pointer"
                            >
                                {/* Image Banner */}
                                <div className="h-40 overflow-hidden relative">
                                    <img src={test.image} alt={test.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border text-white backdrop-blur-md ${test.type === 'Package' ? 'bg-purple-500/80 border-purple-400' : 'bg-blue-500/80 border-blue-400'}`}>
                                            {test.type}
                                        </span>
                                        {test.tat && (
                                            <span className="text-[10px] font-bold text-white/90 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                                                <Clock size={10} /> {test.tat}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-brand-600 transition-colors">{test.title}</h3>
                                    <p className="text-xs text-slate-500 mb-3">{test.testCount} Tests Included</p>

                                    {test.tags && test.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {test.tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-slate-50">
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className="text-2xl font-bold text-slate-900">₹{test.price}</span>
                                            <span className="text-sm text-slate-400 line-through mb-1">₹{test.originalPrice}</span>
                                            <span className="text-sm font-bold text-green-600 mb-1">{test.discount}% off</span>
                                        </div>

                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent opening modal
                                                toggleCartItem(test.id);
                                            }}
                                            className={`w-full py-3 font-bold rounded-xl border transition-colors flex items-center justify-center gap-2 ${
                                                cart.includes(test.id) 
                                                ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                                : 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20'
                                            }`}
                                        >
                                            {cart.includes(test.id) ? (
                                                <><Trash2 size={16} /> Remove</>
                                            ) : (
                                                <>Add To Cart</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredLabTests.length === 0 && (
                         <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <FlaskConical size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No tests found</h3>
                            <p className="text-slate-500">Try changing the category or search term.</p>
                        </div>
                    )}
                    
                    {/* CART FLOATING BAR */}
                    {cart.length > 0 && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-[calc(50%+130px)] z-[60] w-full max-w-md px-4 animate-fade-in-up">
                            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">{cart.length} Items Selected</p>
                                    <p className="text-xl font-bold">₹{getCartTotal()}</p>
                                </div>
                                <button 
                                    onClick={handleOpenCart}
                                    className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-brand-50 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                    View Cart <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- VIEW: PAYMENTS & RECEIPTS (NEW) --- */}
            {activeTab === 'payments' && (
                <div className="animate-fade-in space-y-6">
                    {/* ... (Payments content unchanged) ... */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">Total Spent (This Year)</p>
                                <h2 className="text-4xl font-bold">₹{paymentHistory.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h2>
                            </div>
                            <button className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center gap-2">
                                <CreditCard size={18} /> Manage Cards
                            </button>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">Transaction History</h3>
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 tracking-wider">
                                        <th className="p-6 font-semibold">Transaction ID</th>
                                        <th className="p-6 font-semibold">Date</th>
                                        <th className="p-6 font-semibold">Doctor / Service</th>
                                        <th className="p-6 font-semibold">Amount</th>
                                        <th className="p-6 font-semibold">Status</th>
                                        <th className="p-6 font-semibold text-right">Receipt</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {paymentHistory.map((receipt) => (
                                        <tr key={receipt.transactionId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6 font-mono text-slate-500">{receipt.transactionId}</td>
                                            <td className="p-6 font-medium text-slate-900">{receipt.date}</td>
                                            <td className="p-6">
                                                <p className="font-bold text-slate-900">{receipt.doctorName}</p>
                                                <p className="text-xs text-slate-500">{receipt.description}</p>
                                            </td>
                                            <td className="p-6 font-bold text-slate-900">₹{receipt.amount}</td>
                                            <td className="p-6">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                    <Check size={10} /> {receipt.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                                                    <Receipt size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- VIEW: BOOK DOCTOR --- */}
            {activeTab === 'book-doctor' && (
                <div className="animate-fade-in">
                    
                    {/* Filters & Search */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search doctor, condition, or specialty..." 
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all shadow-sm"
                                />
                            </div>
                            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-brand-500 hover:text-brand-600 transition-all flex items-center gap-2 shadow-sm">
                                <Filter size={20} /> Filters
                            </button>
                        </div>

                        {/* Filter Pills */}
                        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {SPECIALTY_FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedSpecialty(filter)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                                        selectedSpecialty === filter 
                                        ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Doctors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-1 right-1 flex items-center gap-0.5 text-[10px] font-bold text-white bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                            <Star size={8} className="fill-amber-400 text-amber-400" /> {doctor.rating}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900 text-lg leading-tight truncate pr-2">{doctor.name}</h3>
                                            <button className="text-slate-300 hover:text-red-500 transition-colors">
                                                <Heart size={18} />
                                            </button>
                                        </div>
                                        <p className="text-brand-600 text-xs font-bold uppercase tracking-wide mt-1">{doctor.specialty}</p>
                                        <p className="text-slate-500 text-sm mt-0.5 truncate">{doctor.hospital} • {doctor.experience} Exp</p>
                                    </div>
                                </div>
                                
                                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Next Available</p>
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                                            <Clock size={14} className="text-brand-500" /> {doctor.nextAvailable}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation</p>
                                        <p className="text-sm font-bold text-slate-900">₹{doctor.price}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => openBookingModal(doctor)}
                                    className="w-full mt-4 py-3 bg-brand-50 text-brand-600 font-bold rounded-xl border border-brand-100 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all active:scale-95"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>

                    {filteredDoctors.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No doctors found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search query.</p>
                            <button 
                                onClick={() => { setSelectedSpecialty('All'); setSearchQuery(''); }}
                                className="mt-4 text-brand-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
            
          </div>
        </div>
      </main>

      {/* REPORT VIEWER MODAL */}
      {viewingReport && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in-up h-[80vh]">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                        viewingReport.type === 'Lab Report' ? 'bg-blue-100 text-blue-600' :
                        viewingReport.type === 'Prescription' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                        {viewingReport.type === 'Lab Report' ? <FlaskConical size={24} /> : viewingReport.type === 'Prescription' ? <Pill size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{viewingReport.title}</h3>
                        <p className="text-xs text-slate-500">{viewingReport.doctorOrLab} • {viewingReport.date}</p>
                    </div>
                </div>
                <button onClick={closeReportModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Viewer Content */}
            <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-center justify-center">
                {/* Placeholder Document Visualization */}
                <div className="bg-white w-full h-full max-w-2xl shadow-xl rounded-xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        {viewingReport.fileType === 'PDF' ? <FileText size={48} /> : <ImageIcon size={48} />}
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Preview Not Available</h4>
                    <p className="text-slate-500 max-w-xs mb-8">This is a secure document. Please download the file to view the full report content.</p>
                    <button 
                        onClick={() => alert(`Downloading ${viewingReport.title}...`)}
                        className="bg-brand-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center gap-2"
                    >
                        <Download size={18} /> Download {viewingReport.fileType} ({viewingReport.fileSize})
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB TEST DETAILS MODAL */}
      {viewLabTest && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          {/* ... (Details modal content remains unchanged) ... */}
          <div className="bg-white w-full max-w-2xl h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Header Image */}
            <div className="h-48 relative shrink-0">
               <img src={viewLabTest.image} className="w-full h-full object-cover" alt={viewLabTest.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
               <button 
                  onClick={closeLabTestModal}
                  className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-md transition-colors"
               >
                  <X size={20} />
               </button>
               <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border text-white backdrop-blur-md ${viewLabTest.type === 'Package' ? 'bg-purple-500/80 border-purple-400' : 'bg-blue-500/80 border-blue-400'}`}>
                        {viewLabTest.type}
                    </span>
                    {viewLabTest.tat && (
                        <span className="text-[10px] font-bold text-white/90 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                            <Clock size={10} /> TAT: {viewLabTest.tat}
                        </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{viewLabTest.title}</h2>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50">
               
               <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <p className="text-3xl font-bold text-slate-900">₹{viewLabTest.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <p className="text-sm text-slate-400 line-through">₹{viewLabTest.originalPrice}</p>
                           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{viewLabTest.discount}% OFF</span>
                        </div>
                     </div>
                     <div className="text-right">
                         <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                             <ShieldCheck size={14} /> Certified Lab
                         </div>
                     </div>
                  </div>
                  
                  {/* Location Block */}
                  <div className="flex items-start gap-3 mb-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                     <div className="mt-0.5 text-brand-600">
                         <MapPin size={18} />
                     </div>
                     <div>
                         <h4 className="text-xs font-bold text-slate-500 uppercase">Lab Location</h4>
                         <p className="text-sm font-bold text-slate-900">{viewLabTest.location}</p>
                     </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{viewLabTest.description}</p>
               </div>

               {/* Included Tests */}
               {viewLabTest.testsIncluded && viewLabTest.testsIncluded.length > 0 && (
                   <div className="mb-6">
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                           <FlaskConical size={16} className="text-brand-500" /> 
                           Tests Included ({viewLabTest.testsIncluded.length})
                       </h3>
                       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                           {viewLabTest.testsIncluded.map((test, index) => (
                               <div key={index} className="p-3 border-b border-slate-100 last:border-0 flex items-center gap-3 text-sm text-slate-700">
                                   <div className="w-1.5 h-1.5 bg-brand-400 rounded-full"></div>
                                   {test}
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* Preparation */}
               {viewLabTest.preparation && viewLabTest.preparation.length > 0 && (
                   <div className="mb-6">
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                           <Info size={16} className="text-brand-500" /> 
                           Preparation
                       </h3>
                       <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                           <ul className="space-y-2">
                               {viewLabTest.preparation.map((prep, index) => (
                                   <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
                                       <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                                       <span>{prep}</span>
                                   </li>
                               ))}
                           </ul>
                       </div>
                   </div>
               )}

            </div>

            {/* Footer Action */}
            <div className="p-6 bg-white border-t border-slate-200 shrink-0">
                <button 
                    onClick={() => {
                        toggleCartItem(viewLabTest.id);
                        closeLabTestModal();
                    }}
                    className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                        cart.includes(viewLabTest.id)
                        ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                        : 'bg-brand-600 text-white shadow-brand-500/30 hover:bg-brand-700'
                    }`}
                >
                    {cart.includes(viewLabTest.id) ? (
                        <><Trash2 size={18} /> Remove from Cart</>
                    ) : (
                        <><ShoppingCart size={18} /> Add to Cart</>
                    )}
                </button>
            </div>

          </div>
        </div>
      )}

      {/* MEDICINE DETAILS MODAL */}
      {viewMedicine && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in-up max-h-[85vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
               <h2 className="text-xl font-bold text-slate-900">Product Details</h2>
               <button onClick={closeMedicineModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <X size={20} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50">
               <div className="flex flex-col md:flex-row gap-6 mb-6">
                   <div className="w-full md:w-1/3 bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center h-48">
                        <img src={viewMedicine.image} alt={viewMedicine.name} className="h-full object-contain" />
                   </div>
                   <div className="flex-1">
                       <div className="flex flex-wrap gap-2 mb-2">
                           <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">{viewMedicine.type}</span>
                           <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{viewMedicine.category}</span>
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 mb-1">{viewMedicine.name}</h3>
                       <p className="text-sm text-slate-500 mb-4">{viewMedicine.packSize} • {viewMedicine.manufacturer}</p>
                       
                       <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl font-bold text-slate-900">₹{viewMedicine.price}</span>
                            <span className="text-sm text-slate-400 line-through">₹{viewMedicine.originalPrice}</span>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{viewMedicine.discount}% OFF</span>
                       </div>

                       <div className="p-3 bg-white rounded-xl border border-slate-100">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-1">Dosage / Size</p>
                           <p className="text-sm font-bold text-slate-900">{viewMedicine.dosage}</p>
                       </div>
                   </div>
               </div>

               <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                       <Info size={16} className="text-brand-500" /> Description
                   </h4>
                   <p className="text-sm text-slate-600 leading-relaxed">{viewMedicine.description}</p>
               </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-white border-t border-slate-200 shrink-0">
                <button 
                    onClick={() => {
                        togglePharmacyCartItem(viewMedicine.id);
                        closeMedicineModal();
                    }}
                    className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                        pharmacyCart.includes(viewMedicine.id)
                        ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                        : 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-slate-800'
                    }`}
                >
                    {pharmacyCart.includes(viewMedicine.id) ? (
                        <><Trash2 size={18} /> Remove from Cart</>
                    ) : (
                        <><ShoppingCart size={18} /> Add to Cart</>
                    )}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* AI FAB (Fixed Bottom Right) */}
      <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
        <button 
          onClick={handleOpenChat}
          className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95 group relative"
        >
           <MessageCircle size={28} className="group-hover:animate-pulse" />
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
           </span>
        </button>
      </div>

      {/* CHAT OVERLAY */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 z-[60] w-[380px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up">
           
           {/* Chat Header */}
           <div className="bg-brand-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <BrainCircuit size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-sm">MediConnect AI</h3>
                    <div className="flex items-center gap-1.5 opacity-80">
                       <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                       <span className="text-[10px] font-medium">Online</span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                 <X size={18} />
              </button>
           </div>

           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
              {chatMessages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    
                    {msg.sender === 'bot' && (
                       <div className="w-8 h-8 rounded-full bg-brand-100 flex-shrink-0 mr-2 flex items-center justify-center text-brand-600 self-end mb-1">
                          <BrainCircuit size={14} />
                       </div>
                    )}

                    <div className={`max-w-[80%] space-y-2`}>
                       {msg.text && (
                          <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                             msg.sender === 'user' 
                             ? 'bg-brand-600 text-white rounded-br-none' 
                             : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                          }`}>
                             {msg.text}
                          </div>
                       )}

                       {/* Doctor Recommendations Card */}
                       {msg.type === 'doctor-recommendation' && msg.doctors && (
                          <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 space-y-3">
                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top {msg.categoryRecommended}s</p>
                             {msg.doctors.map(doc => (
                                <div 
                                    key={doc.id} 
                                    onClick={() => {
                                        setIsChatOpen(false);
                                        openBookingModal(doc);
                                    }}
                                    className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100"
                                >
                                   <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                                   <div className="flex-1 min-w-0">
                                      <h5 className="font-bold text-slate-900 text-sm">{doc.name}</h5>
                                      <p className="text-xs text-slate-500">{doc.hospital}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                         <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                            <Star size={8} className="fill-current" /> {doc.rating}
                                         </span>
                                         <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md font-medium">
                                            {doc.nextAvailable}
                                         </span>
                                      </div>
                                   </div>
                                   <button className="self-center p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-600 hover:text-white transition-colors">
                                      <Calendar size={14} />
                                   </button>
                                </div>
                             ))}
                             <button 
                                onClick={() => {
                                    setIsChatOpen(false);
                                    setActiveTab('book-doctor');
                                    setSelectedSpecialty(msg.categoryRecommended || 'All');
                                }}
                                className="w-full py-2 text-xs font-bold text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
                             >
                                View all Doctors
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
              ))}
              
              {isTyping && (
                 <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex-shrink-0 mr-2 flex items-center justify-center text-brand-600 self-end mb-1">
                       <BrainCircuit size={14} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
                       <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                       </div>
                    </div>
                 </div>
              )}
              <div ref={chatEndRef} />
           </div>

           {/* Input Area */}
           <div className="p-3 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-2">
                 <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your symptoms..." 
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                 />
                 <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="absolute right-2 p-2 bg-brand-600 text-white rounded-lg shadow-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                 >
                    <Send size={16} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* VIEW ALL SYMPTOMS MODAL */}
      {viewAllSymptomsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-xl font-bold text-slate-900">Select Symptoms</h3>
               <button 
                  onClick={() => setViewAllSymptomsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
               >
                  <X size={20} />
               </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
               <p className="text-slate-500 mb-6">Select a symptom to start an AI assessment and find the right specialist.</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {SYMPTOMS_LIST.map((symptom) => (
                     <button 
                        key={symptom.id}
                        onClick={() => handleSymptomClick(symptom)}
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all group text-center"
                     >
                        <div className={`w-12 h-12 rounded-xl ${symptom.bg} ${symptom.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                           <symptom.icon size={24} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm group-hover:text-brand-700">{symptom.label}</span>
                     </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* LAB CART & CHECKOUT MODAL (Slide Up) */}
      {isCartOpen && (
          <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-lg h-[85vh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col relative">
                  
                  {/* Modal Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                      {(labBookingStep === 'cart' && activeTab !== 'pharmacy') || (pharmacyBookingStep === 'cart' && activeTab === 'pharmacy') ? (
                          <div className="flex items-center gap-3">
                              {/* Standardized Cart Icon */}
                              <ShoppingCart size={24} className="text-brand-600" />
                              <h3 className="text-xl font-bold text-slate-900">Your Cart</h3>
                              <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                  {activeTab === 'pharmacy' ? pharmacyCart.length : cart.length} Items
                              </span>
                          </div>
                      ) : null}

                      {(labBookingStep === 'payment' || pharmacyBookingStep === 'payment' || pharmacyBookingStep === 'shipping') && (
                          <div className="flex items-center gap-3">
                               <button 
                                onClick={() => activeTab === 'pharmacy' 
                                    ? (pharmacyBookingStep === 'payment' ? setPharmacyBookingStep('shipping') : setPharmacyBookingStep('cart'))
                                    : setLabBookingStep('cart')
                                } 
                                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 mr-1"
                               >
                                   <ArrowLeft size={20}/>
                               </button>
                               <h3 className="text-xl font-bold text-slate-900">{pharmacyBookingStep === 'shipping' ? 'Shipping' : 'Checkout'}</h3>
                          </div>
                      )}
                      
                      {(labBookingStep === 'success' || pharmacyBookingStep === 'success') && (
                           <h3 className="text-xl font-bold text-slate-900">Order Confirmed</h3>
                      )}

                      {(labBookingStep !== 'success' && pharmacyBookingStep !== 'success') && (
                          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                              <X size={20} />
                          </button>
                      )}
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
                      {/* === LAB TESTS CART === */}
                      {activeTab !== 'pharmacy' && labBookingStep === 'cart' && (
                          cart.length > 0 ? (
                            <div className="p-6 space-y-4">
                                {cart.map(id => {
                                    const item = LAB_TESTS.find(t => t.id === id);
                                    if (!item) return null;
                                    return (
                                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                   <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${item.type === 'Package' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                      {item.type}
                                                   </span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.title}</h4>
                                                <div className="flex items-baseline gap-2 mt-2">
                                                    <span className="font-bold text-brand-600">₹{item.price}</span>
                                                    <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleCartItem(item.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-6">
                                <ShoppingCart size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-500 font-medium">Your cart is empty.</p>
                                <button onClick={() => setIsCartOpen(false)} className="mt-4 text-brand-600 font-bold hover:underline">Browse Tests</button>
                            </div>
                        )
                      )}

                      {/* === PHARMACY CART === */}
                      {activeTab === 'pharmacy' && pharmacyBookingStep === 'cart' && (
                          pharmacyCart.length > 0 ? (
                            <div className="p-6 space-y-4">
                                {pharmacyCart.map(id => {
                                    const item = MEDICINES.find(t => t.id === id);
                                    if (!item) return null;
                                    return (
                                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                                            <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center mr-4">
                                                <img src={item.image} alt={item.name} className="h-12 w-12 object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                                                <p className="text-[10px] text-slate-500 mb-1">{item.packSize}</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-bold text-slate-900">₹{item.price}</span>
                                                    <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => togglePharmacyCartItem(item.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 px-6">
                                <ShoppingCart size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-500 font-medium">Your pharmacy cart is empty.</p>
                                <button onClick={() => setIsCartOpen(false)} className="mt-4 text-brand-600 font-bold hover:underline">Browse Medicines</button>
                            </div>
                        )
                      )}
                      
                      {/* === LAB PAYMENT === */}
                      {activeTab !== 'pharmacy' && labBookingStep === 'payment' && (
                          <div className="p-6">
                              {/* Order Summary */}
                              <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Order Summary</h4>
                                  <div className="space-y-2">
                                      <div className="flex justify-between text-sm text-slate-600">
                                          <span>Lab Tests ({cart.length})</span>
                                          <span>₹{getCartTotal()}</span>
                                      </div>
                                      <div className="flex justify-between text-sm text-slate-600">
                                          <span>Sample Collection</span>
                                          <span className="text-green-600 font-bold">FREE</span>
                                      </div>
                                      <div className="border-t border-slate-100 my-2 pt-2 flex justify-between font-bold text-slate-900 text-lg">
                                          <span>Total Pay</span>
                                          <span>₹{getCartTotal()}</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Payment Form */}
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Payment Method</h4>
                              <div className="space-y-4 mb-8">
                                  <div className="relative">
                                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                      <input type="text" placeholder="Card Number" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                      <input type="text" placeholder="CVV" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* === PHARMACY SHIPPING === */}
                      {activeTab === 'pharmacy' && pharmacyBookingStep === 'shipping' && (
                          <div className="p-6">
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Shipping Address</h4>
                              <div className="space-y-4">
                                   <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                                      <input type="text" defaultValue="Daniel Bruk" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-xs font-bold text-slate-700">Street Address</label>
                                      <input type="text" placeholder="House No, Street" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-700">City</label>
                                          <input type="text" placeholder="Bangalore" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-xs font-bold text-slate-700">Pincode</label>
                                          <input type="text" placeholder="560001" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                       </div>
                                   </div>
                              </div>
                          </div>
                      )}

                      {/* === PHARMACY PAYMENT === */}
                      {activeTab === 'pharmacy' && pharmacyBookingStep === 'payment' && (
                          <div className="p-6">
                              <div className="bg-white p-5 rounded-2xl border border-slate-200 mb-6 shadow-sm">
                                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Order Summary</h4>
                                  <div className="space-y-2">
                                      <div className="flex justify-between text-sm text-slate-600">
                                          <span>Medicines ({pharmacyCart.length})</span>
                                          <span>₹{getPharmacyCartTotal()}</span>
                                      </div>
                                      <div className="flex justify-between text-sm text-slate-600">
                                          <span>Delivery</span>
                                          <span className="text-green-600 font-bold">FREE</span>
                                      </div>
                                      <div className="border-t border-slate-100 my-2 pt-2 flex justify-between font-bold text-slate-900 text-lg">
                                          <span>Total Pay</span>
                                          <span>₹{getPharmacyCartTotal()}</span>
                                      </div>
                                  </div>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Payment Method</h4>
                              <div className="space-y-4 mb-8">
                                  <div className="relative">
                                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                      <input type="text" placeholder="Card Number" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                      <input type="text" placeholder="CVV" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* === SUCCESS STATES === */}
                      {(labBookingStep === 'success' || pharmacyBookingStep === 'success') && (
                          <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                  <Check size={40} className="text-green-500" />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
                              <p className="text-slate-500 mb-8">
                                  {activeTab === 'pharmacy' ? 'Your medicines will be delivered within 24 hours.' : 'Your lab test appointment has been scheduled successfully.'}
                              </p>
                              {activeTab === 'pharmacy' ? (
                                   <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                       <Truck className="text-brand-600" />
                                       <div className="text-left">
                                           <p className="text-xs text-slate-400 font-bold uppercase">Estimated Delivery</p>
                                           <p className="font-bold text-slate-900">Tomorrow, by 6 PM</p>
                                       </div>
                                   </div>
                              ) : (
                                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                       <Calendar className="text-brand-600" />
                                       <div className="text-left">
                                           <p className="text-xs text-slate-400 font-bold uppercase">Sample Collection</p>
                                           <p className="font-bold text-slate-900">Tomorrow, 08:00 AM</p>
                                       </div>
                                   </div>
                              )}
                          </div>
                      )}

                  </div>

                  {/* Modal Footer (Sticky) */}
                  {(labBookingStep !== 'success' && pharmacyBookingStep !== 'success') && (
                      <div className="p-6 border-t border-slate-100 bg-white">
                          
                          {/* LAB: CART -> CHECKOUT */}
                          {activeTab !== 'pharmacy' && labBookingStep === 'cart' && (
                              <button 
                                  onClick={handleLabCheckout}
                                  disabled={cart.length === 0}
                                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                  Proceed to Checkout <ChevronRight size={18} />
                              </button>
                          )}

                          {/* LAB: PAYMENT -> PAY */}
                          {activeTab !== 'pharmacy' && labBookingStep === 'payment' && (
                              <button 
                                  onClick={handleConfirmLabPayment}
                                  disabled={isProcessingLabPayment}
                                  className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                              >
                                  {isProcessingLabPayment ? 'Processing...' : `Pay ₹${getCartTotal()}`}
                              </button>
                          )}

                          {/* PHARMACY: CART -> SHIPPING */}
                          {activeTab === 'pharmacy' && pharmacyBookingStep === 'cart' && (
                              <button 
                                  onClick={handlePharmacyCheckout}
                                  disabled={pharmacyCart.length === 0}
                                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                  Proceed to Shipping <ChevronRight size={18} />
                              </button>
                          )}

                           {/* PHARMACY: SHIPPING -> PAYMENT */}
                           {activeTab === 'pharmacy' && pharmacyBookingStep === 'shipping' && (
                              <button 
                                  onClick={handlePharmacyShipping}
                                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                              >
                                  Proceed to Payment <ChevronRight size={18} />
                              </button>
                          )}

                          {/* PHARMACY: PAYMENT -> PAY */}
                          {activeTab === 'pharmacy' && pharmacyBookingStep === 'payment' && (
                              <button 
                                  onClick={handleConfirmPharmacyPayment}
                                  disabled={isProcessingPharmaPayment}
                                  className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                              >
                                  {isProcessingPharmaPayment ? 'Processing...' : `Pay ₹${getPharmacyCartTotal()}`}
                              </button>
                          )}
                      </div>
                  )}

                  {/* Success Footer */}
                  {(labBookingStep === 'success' || pharmacyBookingStep === 'success') && (
                      <div className="p-6 border-t border-slate-100 bg-white">
                          <button 
                              onClick={activeTab === 'pharmacy' ? handlePharmacyOrderComplete : handleLabOrderComplete}
                              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all"
                          >
                              View Receipt
                          </button>
                      </div>
                  )}

              </div>
          </div>
      )}

      {/* Booking Modal for Doctor - Needs to be rendered if selectedDoctor is not null */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                 <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="text-xl font-bold text-slate-900">
                         {bookingStep === 'details' ? 'Book Appointment' : 
                          bookingStep === 'payment' ? 'Confirm & Pay' : 'Booking Confirmed'}
                     </h3>
                     {bookingStep !== 'success' && (
                        <button onClick={closeBookingModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <X size={20} />
                        </button>
                     )}
                 </div>

                 <div className="p-6">
                     {bookingStep === 'details' && (
                         <div className="space-y-6">
                             <div className="flex items-center gap-4">
                                 <img src={selectedDoctor.image} className="w-16 h-16 rounded-xl object-cover" alt="Doctor" />
                                 <div>
                                     <h4 className="font-bold text-lg text-slate-900">{selectedDoctor.name}</h4>
                                     <p className="text-sm text-slate-500">{selectedDoctor.specialty} • {selectedDoctor.hospital}</p>
                                 </div>
                             </div>

                             <div>
                                 <label className="text-xs font-bold text-slate-700 uppercase mb-2 block">Consultation Type</label>
                                 <div className="grid grid-cols-2 gap-3">
                                     <button 
                                        onClick={() => setBookingType('video')}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${bookingType === 'video' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
                                     >
                                         <Video size={18} /> Video Call
                                     </button>
                                     <button 
                                        onClick={() => setBookingType('clinic')}
                                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${bookingType === 'clinic' ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-200 text-slate-600'}`}
                                     >
                                         <MapPin size={18} /> Clinic Visit
                                     </button>
                                 </div>
                             </div>

                             <div>
                                 <label className="text-xs font-bold text-slate-700 uppercase mb-2 block">Select Date</label>
                                 <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                     {['Today', 'Tomorrow', 'Fri, 28 Jan', 'Sat, 29 Jan'].map(date => (
                                         <button 
                                            key={date}
                                            onClick={() => setBookingDate(date)}
                                            className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-bold transition-all ${bookingDate === date ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
                                         >
                                             {date}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             <div>
                                 <label className="text-xs font-bold text-slate-700 uppercase mb-2 block">Select Time</label>
                                 <div className="grid grid-cols-3 gap-2">
                                     {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'].map(time => (
                                         <button 
                                            key={time}
                                            onClick={() => setBookingTime(time)}
                                            className={`px-2 py-2 rounded-lg border text-sm font-medium transition-all ${bookingTime === time ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-600 border-slate-200'}`}
                                         >
                                             {time}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             <button 
                                onClick={handleProceedToPayment}
                                disabled={!bookingTime}
                                className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                             >
                                Proceed to Pay ₹{selectedDoctor.price}
                             </button>
                         </div>
                     )}

                     {bookingStep === 'payment' && (
                         <div className="space-y-6">
                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <div className="flex justify-between mb-2 text-sm text-slate-600">
                                      <span>Consultation Fee</span>
                                      <span>₹{selectedDoctor.price}</span>
                                  </div>
                                  <div className="flex justify-between mb-2 text-sm text-slate-600">
                                      <span>Service Charge</span>
                                      <span>₹50</span>
                                  </div>
                                  <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold text-slate-900 text-lg">
                                      <span>Total</span>
                                      <span>₹{selectedDoctor.price + 50}</span>
                                  </div>
                              </div>

                              <div>
                                  <label className="text-xs font-bold text-slate-700 uppercase mb-3 block">Card Details</label>
                                  <div className="space-y-3">
                                      <div className="relative">
                                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                          <input type="text" placeholder="Card Number" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                          <input type="text" placeholder="CVV" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500" />
                                      </div>
                                  </div>
                              </div>

                              <button 
                                onClick={handleConfirmPayment}
                                disabled={isProcessingPayment}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                             >
                                {isProcessingPayment ? 'Processing...' : `Pay ₹${selectedDoctor.price + 50}`}
                             </button>
                         </div>
                     )}

                     {bookingStep === 'success' && (
                         <div className="text-center py-8">
                             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                 <Check size={40} className="text-green-500" />
                             </div>
                             <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
                             <p className="text-slate-500 mb-8">
                                 Your appointment with Dr. {selectedDoctor.name} has been scheduled for {bookingDate} at {bookingTime}.
                             </p>
                             <button 
                                onClick={closeBookingModal}
                                className="w-full py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg hover:bg-brand-700 transition-all"
                             >
                                Go to Appointments
                             </button>
                         </div>
                     )}
                 </div>
             </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;