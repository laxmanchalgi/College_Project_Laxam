import React, { useEffect, useState } from "react";
import { Booking, User, Review, Itinerary, dataService } from "../services/dataService";
import Navbar from "../components/Navbar";
import { Trash2, Edit, X, Check, Users, Map, Star, Calendar, Plus, Globe, FileText, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type TabType = "bookings" | "users" | "destinations" | "reviews" | "itineraries";

export default function AdminPage() {
  const { isSuperAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("bookings");
  
  // Edit states
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDestination, setEditDestination] = useState<any | null>(null);
  const [isAddingDestination, setIsAddingDestination] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, usersData, statsData, destData, reviewsData, itinerariesData] = await Promise.all([
        dataService.getAllBookings(),
        dataService.getAllUsers(),
        dataService.getAdminStats(),
        dataService.getDestinations(),
        new Promise<Review[]>((resolve) => dataService.subscribeToReviews(resolve)),
        dataService.getAllItineraries()
      ]);
      setBookings(bookingsData);
      setUsers(usersData);
      setStats(statsData);
      setDestinations(destData);
      setReviews(reviewsData);
      setItineraries(itinerariesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: TabType, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) return;
    try {
      switch (type) {
        case "bookings": await dataService.deleteBooking(id); break;
        case "users": await dataService.deleteUser(id); break;
        case "destinations": await dataService.deleteDestination(id); break;
        case "reviews": await dataService.deleteReview(id); break;
        case "itineraries": await dataService.deleteItinerary(id); break;
      }
      loadData();
    } catch (err: any) {
      alert(err.message || `Failed to delete ${type.slice(0, -1)}`);
    }
  };

  const handleUpdateBooking = async () => {
    if (!editBooking) return;
    try {
      await dataService.updateBooking(editBooking.id, editBooking);
      setEditBooking(null);
      loadData();
    } catch (err) {
      alert("Failed to update booking");
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      await dataService.updateUser(editUser.uid, editUser);
      setEditUser(null);
      loadData();
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleSaveDestination = async () => {
    if (!editDestination) return;
    try {
      if (isAddingDestination) {
        await dataService.addDestination(editDestination);
      } else {
        await dataService.updateDestination(editDestination.id, editDestination);
      }
      setEditDestination(null);
      setIsAddingDestination(false);
      loadData();
    } catch (err) {
      alert("Failed to save destination");
    }
  };

  const handleApproveUser = async (uid: string) => {
    try {
      await dataService.approveUser(uid);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to approve user");
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-serif mb-2">Admin Dashboard</h1>
            <p className="text-black/50">Full control over users, trips, and all platform data.</p>
          </div>
          <div className="flex gap-4">
            {activeTab === "destinations" && (
              <button 
                onClick={() => {
                  setEditDestination({ name: "", country: "", description: "", price: 0, rating: 5, category: "Coastal", image: "" });
                  setIsAddingDestination(true);
                }}
                className="px-6 py-2 bg-brand-gold text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Trip
              </button>
            )}
            <button 
              onClick={loadData}
              className="px-6 py-2 bg-brand-dark text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { label: "Bookings", value: stats.totalBookings, icon: Calendar, color: "text-blue-500" },
              { label: "Users", value: stats.totalUsers, icon: Users, color: "text-green-500" },
              { label: "Reviews", value: stats.totalReviews, icon: Star, color: "text-amber-500" },
              { label: "Itineraries", value: stats.totalItineraries, icon: FileText, color: "text-purple-500" },
              { label: "Trips", value: destinations.length, icon: Globe, color: "text-emerald-500" }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl bg-black/5 ${s.color}`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">{s.label}</span>
                </div>
                <div className="text-2xl font-serif">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["bookings", "users", "destinations", "reviews", "itineraries"] as TabType[]).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-brand-dark text-white" : "bg-white text-black/40 hover:bg-black/5"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-black/5 overflow-hidden">
            <div className="overflow-x-auto">
              {activeTab === "bookings" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-8 py-6">User</th>
                      <th className="px-8 py-6">Destination</th>
                      <th className="px-8 py-6">Travelers</th>
                      <th className="px-8 py-6">Dates</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-brand-paper/50 transition-colors">
                        <td className="px-8 py-6 font-mono text-[10px] text-black/60">{b.uid}</td>
                        <td className="px-8 py-6 font-medium">{b.destination}</td>
                        <td className="px-8 py-6">{b.travelers}</td>
                        <td className="px-8 py-6 text-xs text-black/60">{b.startDate} → {b.endDate}</td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${b.status === "Confirmed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                            {b.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditBooking(b)} className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-gold"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete("bookings", b.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "users" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-8 py-6">Name</th>
                      <th className="px-8 py-6">Email</th>
                      <th className="px-8 py-6">Role</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {users.map((u) => (
                      <tr key={u.uid} className="hover:bg-brand-paper/50 transition-colors">
                        <td className="px-8 py-6 font-medium">{u.displayName}</td>
                        <td className="px-8 py-6">{u.email}</td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${u.role === "ADMIN" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${u.approved ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {u.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                            {isSuperAdmin && !u.approved && (
                              <button 
                                onClick={() => handleApproveUser(u.uid)} 
                                className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                                title="Approve User"
                              >
                                <ShieldCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => setEditUser(u)} className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-gold"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete("users", u.uid)} disabled={u.uid === "admin-uid"} className="p-2 hover:bg-red-50 rounded-lg text-red-500 disabled:opacity-0"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "destinations" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-8 py-6">Trip Name</th>
                      <th className="px-8 py-6">Country</th>
                      <th className="px-8 py-6">Price</th>
                      <th className="px-8 py-6">Rating</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {destinations.map((d) => (
                      <tr key={d.id} className="hover:bg-brand-paper/50 transition-colors">
                        <td className="px-8 py-6 font-medium">{d.name}</td>
                        <td className="px-8 py-6">{d.country}</td>
                        <td className="px-8 py-6 font-mono text-xs">${d.price}</td>
                        <td className="px-8 py-6 flex items-center gap-1"><Star className="w-3 h-3 text-brand-gold fill-brand-gold" /> {d.rating}</td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditDestination(d); setIsAddingDestination(false); }} className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-gold"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete("destinations", d.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "reviews" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-8 py-6">User</th>
                      <th className="px-8 py-6">Destination</th>
                      <th className="px-8 py-6">Rating</th>
                      <th className="px-8 py-6">Comment</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-brand-paper/50 transition-colors">
                        <td className="px-8 py-6 font-medium">{r.userName}</td>
                        <td className="px-8 py-6">{r.destination}</td>
                        <td className="px-8 py-6 flex items-center gap-1"><Star className="w-3 h-3 text-brand-gold fill-brand-gold" /> {r.rating}</td>
                        <td className="px-8 py-6 text-xs text-black/60 max-w-xs truncate">{r.comment}</td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end">
                            <button onClick={() => handleDelete("reviews", r.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "itineraries" && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-8 py-6">User ID</th>
                      <th className="px-8 py-6">Destination</th>
                      <th className="px-8 py-6">Duration</th>
                      <th className="px-8 py-6">Created</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {itineraries.map((i) => (
                      <tr key={i.id} className="hover:bg-brand-paper/50 transition-colors">
                        <td className="px-8 py-6 font-mono text-[10px] text-black/60">{i.uid}</td>
                        <td className="px-8 py-6 font-medium">{i.destination}</td>
                        <td className="px-8 py-6">{i.duration} Days</td>
                        <td className="px-8 py-6 text-xs text-black/60">{new Date(i.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end">
                            <button onClick={() => handleDelete("itineraries", i.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {editBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditBooking(null)} />
            <div className="relative bg-white w-full max-w-lg rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-serif mb-8">Edit Booking</h3>
              <div className="space-y-4">
                <input className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editBooking.destination} onChange={(e) => setEditBooking({ ...editBooking, destination: e.target.value })} placeholder="Destination" />
                <input type="number" className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editBooking.travelers} onChange={(e) => setEditBooking({ ...editBooking, travelers: Number(e.target.value) })} placeholder="Travelers" />
                <select className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editBooking.status} onChange={(e) => setEditBooking({ ...editBooking, status: e.target.value })}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="flex gap-4 pt-4">
                  <button onClick={handleUpdateBooking} className="flex-1 py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Save</button>
                  <button onClick={() => setEditBooking(null)} className="flex-1 py-4 bg-black/5 text-black rounded-2xl font-bold uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditUser(null)} />
            <div className="relative bg-white w-full max-w-lg rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-serif mb-8">Edit User</h3>
              <div className="space-y-4">
                <input className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editUser.displayName} onChange={(e) => setEditUser({ ...editUser, displayName: e.target.value })} placeholder="Display Name" />
                <input className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} placeholder="Email" />
                <select className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <div className="flex gap-4 pt-4">
                  <button onClick={handleUpdateUser} className="flex-1 py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Save</button>
                  <button onClick={() => setEditUser(null)} className="flex-1 py-4 bg-black/5 text-black rounded-2xl font-bold uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Destination Modal */}
        {editDestination && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditDestination(null)} />
            <div className="relative bg-white w-full max-w-lg rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-serif mb-8">{isAddingDestination ? "Add New Trip" : "Edit Trip"}</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                <input className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editDestination.name} onChange={(e) => setEditDestination({ ...editDestination, name: e.target.value })} placeholder="Trip Name" />
                <input className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editDestination.country} onChange={(e) => setEditDestination({ ...editDestination, country: e.target.value })} placeholder="Country" />
                <input type="number" className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editDestination.price} onChange={(e) => setEditDestination({ ...editDestination, price: Number(e.target.value) })} placeholder="Price" />
                <input className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none" value={editDestination.image} onChange={(e) => setEditDestination({ ...editDestination, image: e.target.value })} placeholder="Image URL" />
                <textarea className="w-full px-6 py-4 bg-brand-paper rounded-2xl outline-none h-32" value={editDestination.description} onChange={(e) => setEditDestination({ ...editDestination, description: e.target.value })} placeholder="Description" />
              </div>
              <div className="flex gap-4 pt-8">
                <button onClick={handleSaveDestination} className="flex-1 py-4 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-gold transition-all">Save</button>
                <button onClick={() => { setEditDestination(null); setIsAddingDestination(false); }} className="flex-1 py-4 bg-black/5 text-black rounded-2xl font-bold uppercase tracking-widest">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
