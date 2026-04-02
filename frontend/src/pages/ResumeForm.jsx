import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import {
  ChevronRight,
  ChevronLeft,
  Save,
  User,
  BookOpen,
  Briefcase,
  Cpu,
  Layers,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';

const ResumeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    linkedin: '',
    website: '',
    template: 'modern',
    education: [],
    experience: [],
    skills: [],
    projects: []
  });

  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          const res = await axios.get(`${API_URL}/resumes/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setFormData(res.data);
        } catch (err) {
          console.error('Error fetching resume:', err);
        }
      };
      fetchResume();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = (type) => {
    const newItem = type === 'education'
      ? { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: '', description: '' }
      : type === 'experience'
        ? { company: '', position: '', start_date: '', end_date: '', current_job: false, description: '' }
        : type === 'skills'
          ? { skill_name: '', proficiency: 'Beginner' }
          : { project_name: '', description: '', technologies: '', url: '' };

    setFormData({ ...formData, [type]: [...formData[type], newItem] });
  };

  const handleRemoveItem = (type, index) => {
    const list = [...formData[type]];
    list.splice(index, 1);
    setFormData({ ...formData, [type]: list });
  };

  const handleItemChange = (type, index, e) => {
    const { name, value, type: inputType, checked } = e.target;
    const list = [...formData[type]];
    list[index][name] = inputType === 'checkbox' ? checked : value;
    setFormData({ ...formData, [type]: list });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (id) {
        await axios.put(`${API_URL}/resumes/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${API_URL}/resumes`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving resume:', err);
      alert('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal', icon: <User className="h-5 w-5" /> },
    { title: 'Education', icon: <BookOpen className="h-5 w-5" /> },
    { title: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
    { title: 'Skills', icon: <Cpu className="h-5 w-5" /> },
    { title: 'Projects', icon: <Layers className="h-5 w-5" /> },
    { title: 'Review', icon: <CheckCircle className="h-5 w-5" /> }
  ];

  return (
    <div className="max-w-[1000px] mx-auto w-full p-4 sm:p-12">
      {/* Stepper */}
      <div className="mb-12 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto gap-8">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 flex-shrink-0 transition-opacity ${i + 1 === step ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${i + 1 === step ? 'bg-black text-white' : i + 1 < step ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1 < step ? <CheckCircle className="h-5 w-5" /> : s.icon}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step {i + 1}</p>
              <h4 className="text-sm font-bold text-black">{s.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
        <div className="p-8 sm:p-16 flex-grow ">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight mb-2">Basic Info</h2>
                <p className="text-gray-400 text-sm font-medium">How should recruiters reach you?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Resume Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Software Engineer" className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Full Name</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="input-field" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Phone</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" className="input-field" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">About Me</label>
                  <textarea name="summary" value={formData.summary} onChange={handleChange} rows="4" placeholder="Briefly describe your professional background..." className="input-field resize-none" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Street, City, Country" className="input-field" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {step === 2 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight mb-2">Education</h2>
                  <p className="text-gray-400 text-sm font-medium">Your academic background</p>
                </div>
                <button onClick={() => handleAddItem('education')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-2 border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all">
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>

              {formData.education.length === 0 && <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-bold uppercase tracking-widest text-xs">No entries added</div>}

              <div className="space-y-8">
                {formData.education.map((edu, idx) => (
                  <div key={idx} className="p-8 border border-gray-50 rounded-[32px] bg-gray-50/30 relative">
                    <button onClick={() => handleRemoveItem('education', idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="h-5 w-5" /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Institution</label>
                        <input type="text" name="institution" value={edu.institution} onChange={(e) => handleItemChange('education', idx, e)} placeholder="University of X" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Degree</label>
                        <input type="text" name="degree" value={edu.degree} onChange={(e) => handleItemChange('education', idx, e)} placeholder="Bachelor of Science" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Start Date</label>
                        <input type="text" name="start_date" value={edu.start_date} onChange={(e) => handleItemChange('education', idx, e)} placeholder="Sep 2020" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">End Date</label>
                        <input type="text" name="end_date" value={edu.end_date} onChange={(e) => handleItemChange('education', idx, e)} placeholder="May 2024" className="input-field bg-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="space-y-10 animate-in fade-in duration-500 text-left">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight mb-2">Experience</h2>
                  <p className="text-gray-400 text-sm font-medium">Your career journey so far</p>
                </div>
                <button onClick={() => handleAddItem('experience')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-2 border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all">
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>

              {formData.experience.length === 0 && <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-bold uppercase tracking-widest text-xs">No entries added</div>}

              <div className="space-y-8">
                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="p-8 border border-gray-50 rounded-[32px] bg-gray-50/30 relative">
                    <button onClick={() => handleRemoveItem('experience', idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="h-5 w-5" /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Company</label>
                        <input type="text" name="company" value={exp.company} onChange={(e) => handleItemChange('experience', idx, e)} placeholder="Google Inc." className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Position</label>
                        <input type="text" name="position" value={exp.position} onChange={(e) => handleItemChange('experience', idx, e)} placeholder="Software Engineer" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Start Date</label>
                        <input type="text" name="start_date" value={exp.start_date} onChange={(e) => handleItemChange('experience', idx, e)} placeholder="Jan 2022" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">End Date</label>
                        <input type="text" name="end_date" value={exp.end_date} onChange={(e) => handleItemChange('experience', idx, e)} placeholder="Present" className="input-field bg-white" />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Detailed Responsibilities</label>
                        <textarea name="description" value={exp.description} onChange={(e) => handleItemChange('experience', idx, e)} rows="4" placeholder="What were your key wins?" className="input-field bg-white resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Skills */}
          {step === 4 && (
            <div className="space-y-10 animate-in fade-in duration-500 text-left">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight mb-2">Abilities</h2>
                  <p className="text-gray-400 text-sm font-medium">Your technical and soft skills</p>
                </div>
                <button onClick={() => handleAddItem('skills')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-2 border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all">
                  <Plus className="h-4 w-4" /> New Skill
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group">
                    <input type="text" name="skill_name" value={skill.skill_name} onChange={(e) => handleItemChange('skills', idx, e)} placeholder="Skill name" className="flex-grow input-field bg-white text-sm" />
                    <select name="proficiency" value={skill.proficiency} onChange={(e) => handleItemChange('skills', idx, e)} className="input-field bg-white text-xs font-bold uppercase tracking-widest py-2 w-auto">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Expert</option>
                    </select>
                    <button onClick={() => handleRemoveItem('skills', idx)} className="text-gray-300 hover:text-black transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Projects */}
          {step === 5 && (
            <div className="space-y-10 animate-in fade-in duration-500 text-left">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-black tracking-tight mb-2">Portfolio</h2>
                  <p className="text-gray-400 text-sm font-medium">Showcase your side projects</p>
                </div>
                <button onClick={() => handleAddItem('projects')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black border-2 border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all">
                  <Plus className="h-4 w-4" /> Add Item
                </button>
              </div>

              <div className="space-y-8">
                {formData.projects.map((proj, idx) => (
                  <div key={idx} className="p-8 border border-gray-50 rounded-[32px] bg-gray-50/30 relative">
                    <button onClick={() => handleRemoveItem('projects', idx)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="h-5 w-5" /></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Project Name</label>
                        <input type="text" name="project_name" value={proj.project_name} onChange={(e) => handleItemChange('projects', idx, e)} placeholder="My Cool SaaS" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Technologies</label>
                        <input type="text" name="technologies" value={proj.technologies} onChange={(e) => handleItemChange('projects', idx, e)} placeholder="React, Redis, PostgreSQL" className="input-field bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">URL</label>
                        <input type="text" name="url" value={proj.url} onChange={(e) => handleItemChange('projects', idx, e)} placeholder="https://github.com/..." className="input-field bg-white" />
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Highlight</label>
                        <textarea name="description" value={proj.description} onChange={(e) => handleItemChange('projects', idx, e)} rows="2" placeholder="Brief pitch of the project" className="input-field bg-white resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-10 animate-in fade-in duration-500 text-left">
              <div>
                <h2 className="text-3xl font-black text-black tracking-tight mb-2">Final Review</h2>
                <p className="text-gray-400 text-sm font-medium">One last check before we build your legacy</p>
              </div>
              <div className="p-10 bg-black text-white rounded-[40px] shadow-2xl shadow-black/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-black text-xl">R</div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Summary Checklist</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 opacity-80 uppercase tracking-widest text-[10px] font-bold">
                  <div className="flex justify-between border-b border-white/10 pb-2"><span>Personal Details</span> <span className={formData.full_name ? 'text-green-400' : 'text-red-400'}>{formData.full_name ? 'COMPLETE' : 'INCOMPLETE'}</span></div>
                  <div className="flex justify-between border-b border-white/10 pb-2"><span>Experience Count</span> <span>{formData.experience.length} ENTRIES</span></div>
                  <div className="flex justify-between border-b border-white/10 pb-2"><span>Education Count</span> <span>{formData.education.length} ENTRIES</span></div>
                  <div className="flex justify-between border-b border-white/10 pb-2"><span>Skill Count</span> <span>{formData.skills.length} ENTRIES</span></div>
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium italic text-center">Ready to publish? You can always come back and refine later.</p>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <div className="p-8 px-16 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 scale-90' : 'text-gray-400 hover:text-black'}`}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-300">Step {step} of 6</span>
            {step < 6 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-black flex items-center gap-2 group"
              >
                Next Step <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-black bg-green-500 hover:bg-green-600 flex items-center gap-2"
              >
                {loading ? 'Processing...' : <><Save className="h-4 w-4" /> Finish & Save</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
