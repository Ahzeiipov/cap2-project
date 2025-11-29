// import { useState } from "react";
// import { Header, Card, CardHeader, CardContent, CardTitle, Button } from "../components/ui";
// import { CalendarDays, List, Plus, Edit, Trash2 } from "lucide-react";

// interface Appointment {
//   id: string;
//   patientName: string;
//   patientId: string;
//   doctorName: string;
//   doctorRole: string;
//   date: string;
//   time: string;
//   room: string;
//   reason: string;
//   notes?: string;
// }

// const initialAppointments: Appointment[] = [
//   { id: "1", patientName: "John Doe", patientId: "P001", doctorName: "Dr. Sarah Johnson", doctorRole: "General Physician", date: "2025-01-20", time: "09:00 AM", room: "Room 101", reason: "Regular checkup" },
//   { id: "2", patientName: "Emily Brown", patientId: "P002", doctorName: "Dr. Michael Chen", doctorRole: "Cardiologist", date: "2025-01-20", time: "10:30 AM", room: "Room 203", reason: "Heart consultation" },
//   { id: "3", patientName: "Robert Wilson", patientId: "P003", doctorName: "Dr. Sarah Johnson", doctorRole: "General Physician", date: "2025-01-20", time: "02:00 PM", room: "Room 101", reason: "Follow-up visit" },
//   { id: "4", patientName: "Lisa Anderson", patientId: "P004", doctorName: "Dr. James Martinez", doctorRole: "Pediatrician", date: "2025-01-21", time: "11:00 AM", room: "Room 105", reason: "Child vaccination" },
//   { id: "5", patientName: "David Lee", patientId: "P005", doctorName: "Dr. Michael Chen", doctorRole: "Cardiologist", date: "2025-01-19", time: "03:00 PM", room: "Room 203", reason: "Post-surgery checkup" },
// ];

// const rooms = ["Room 101", "Room 102", "Room 203", "Room 105", "Room 204"];
// const timeSlots = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"];

// export function AppointmentsPage() {
//   const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const getAppointmentForSlot = (room: string, time: string, date: Date) => {
//     const dateStr = date.toISOString().split("T")[0];
//     return appointments.find((apt) => apt.room === room && apt.time === time && apt.date === dateStr);
//   };

//   const changeDate = (days: number) => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() + days);
//     setSelectedDate(newDate);
//   };

//   const filteredAppointments = appointments.filter(
//     (apt) =>
//       apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       apt.patientId.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const stats = {
//     total: appointments.length,
//     today: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0]).length,
//   };

//   return (
//     <div className="appointments-page flex-1 overflow-auto p-6">
//       <Header title="Appointments" subtitle="Manage patient appointments and schedules" />

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 my-4">
//         <Card>
//           <CardHeader><CardTitle>Total Appointments</CardTitle></CardHeader>
//           <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
//         </Card>
//         <Card>
//           <CardHeader><CardTitle>Today's Appointments</CardTitle></CardHeader>
//           <CardContent><div className="text-2xl font-bold">{stats.today}</div></CardContent>
//         </Card>
//       </div>

//       {/* Appointment View Switch */}
//       <Card>
//         <CardHeader className="flex justify-between items-center">
//           <CardTitle>Appointments</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant={viewMode === "calendar" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => setViewMode("calendar")}
//               className={viewMode === "calendar" ? "bg-[#5B6EF5] hover:bg-[#4A5DE4]" : ""}
//             >
//               <CalendarDays className="h-4 w-4 mr-2" /> Calendar
//             </Button>
//             <Button
//               variant={viewMode === "list" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => setViewMode("list")}
//               className={viewMode === "list" ? "bg-[#5B6EF5] hover:bg-[#4455d1]" : ""}
//             >
//               <List className="h-4 w-4 mr-2" /> List
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {viewMode === "calendar" ? (
//             <div>
//               <div className="flex justify-between mb-2">
//                 <Button onClick={() => changeDate(-1)}>Previous</Button>
//                 <div className="font-semibold">{selectedDate.toDateString()}</div>
//                 <Button onClick={() => changeDate(1)}>Next</Button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full border border-gray-300 rounded-lg">
//                   <thead>
//                     <tr className="bg-[#5B6EF5] text-white">
//                       <th className="p-2 border">Time / Room</th>
//                       {rooms.map((room) => (
//                         <th key={room} className="p-2 border">{room}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {timeSlots.map((time) => (
//                       <tr key={time} className="text-center">
//                         <td className="p-2 border font-medium">{time}</td>
//                         {rooms.map((room) => {
//                           const apt = getAppointmentForSlot(room, time, selectedDate);
//                           return (
//                             <td key={room + time} className={`p-2 border ${apt ? "bg-green-100" : "bg-white"}`}>
//                               {apt ? (
//                                 <div>
//                                   <div className="font-semibold">{apt.patientName}</div>
//                                   <div className="text-xs">{apt.doctorName}</div>
//                                 </div>
//                               ) : (
//                                 <div className="text-gray-300">Available</div>
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <input
//                 type="text"
//                 placeholder="Search by patient, doctor, or ID"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="mb-4 w-full p-2 border rounded-lg"
//               />
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border border-gray-300 rounded-lg">
//                   <thead className="bg-[#5B6EF5] text-white">
//                     <tr>
//                       <th className="p-2 border">Patient</th>
//                       <th className="p-2 border">ID</th>
//                       <th className="p-2 border">Doctor</th>
//                       <th className="p-2 border">Role</th>
//                       <th className="p-2 border">Date</th>
//                       <th className="p-2 border">Time</th>
//                       <th className="p-2 border">Room</th>
//                       <th className="p-2 border">Reason</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredAppointments.map((apt) => (
//                       <tr key={apt.id} className="text-center hover:bg-gray-50">
//                         <td className="p-2 border">{apt.patientName}</td>
//                         <td className="p-2 border">{apt.patientId}</td>
//                         <td className="p-2 border">{apt.doctorName}</td>
//                         <td className="p-2 border">{apt.doctorRole}</td>
//                         <td className="p-2 border">{apt.date}</td>
//                         <td className="p-2 border">{apt.time}</td>
//                         <td className="p-2 border">{apt.room}</td>
//                         <td className="p-2 border">{apt.reason}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
