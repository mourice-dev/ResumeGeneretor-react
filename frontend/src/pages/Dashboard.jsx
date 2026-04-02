import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { Plus, Edit3, Trash2, Eye, Calendar, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUrl.js';

const API_URL = getApiUrl();

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'ResumE - My Resumes';
  }, []);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${API_URL}/resumes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`${API_URL}/resumes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchResumes();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const filteredResumes = resumes.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) &&
    (dateFilter ? r.created_at.startsWith(dateFilter) : true)
  );

  return (
    <div className="max-w-[1200px] mx-auto w-full px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-black tracking-tighter mb-2">My Resumes</h1>
          <p className="text-gray-400 font-medium">Manage and refine your professional profiles</p>
        </div>
        <button
          onClick={() => navigate('/resume-builder')}
          className="btn-black flex items-center gap-2 group"
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          Create New
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-10 flex flex-wrap gap-4">
        <div className="flex-grow min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-1 rounded-xl border border-transparent">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent border-none text-sm focus:ring-0"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResumes.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-medium lowercase tracking-widest italic">No matching resumes found</p>
          </div>
        ) : (
          filteredResumes.map(r => (
            <div key={r.id} className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-black transition-all hover:shadow-2xl hover:shadow-black/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-black tracking-tight group-hover:text-black transition-colors">{r.title}</h3>
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-300 group-hover:bg-black group-hover:text-white transition-all">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(r.updated_at || r.created_at).toLocaleDateString()}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded uppercase">{r.template}</span>
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-50 pt-6">
                <button
                  onClick={() => navigate(`/resume-builder/${r.id}`)}
                  className="flex-grow flex items-center justify-center gap-2 py-2 bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => navigate(`/preview/${r.id}`)}
                  className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors"
                  title="Preview"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
