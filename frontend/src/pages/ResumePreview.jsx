import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Printer,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Target
} from 'lucide-react';
import { getApiUrl } from '../utils/apiUrl.js';

const API_URL = getApiUrl();

const ResumePreview = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const resumeRef = useRef();

  useEffect(() => {
    document.title = 'ResumE - Preview Resume';
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axios.get(`${API_URL}/resumes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setResume(res.data);
      } catch (err) {
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handlePrint = async () => {
    if (!resumeRef.current || isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      const safeName = (resume?.full_name || 'resume').trim().replace(/\s+/g, '_');

      const element = resumeRef.current;
      
      // Use a Promise-based approach to ensure PDF generation completes
      return new Promise((resolve, reject) => {
        try {
          html2pdf()
            .set({
              margin: [8, 8, 8, 8],
              filename: `${safeName}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                allowTaint: true
              },
              jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
              },
              pagebreak: { mode: ['css', 'legacy'] }
            })
            .from(element)
            .save()
            .then(() => {
              setIsExporting(false);
              resolve();
            })
            .catch((err) => {
              console.error('Failed to export PDF:', err);
              setIsExporting(false);
              reject(err);
            });
        } catch (err) {
          console.error('Failed to export PDF:', err);
          setIsExporting(false);
          reject(err);
        }
      });
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setIsExporting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-black font-black text-2xl uppercase tracking-tighter">Rendering...</div>;
  if (!resume) return <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest text-xs">Resume not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-12 print:p-0 print:bg-white text-left animate-in fade-in duration-700">
      {/* Control Bar */}
      <div className="max-w-[800px] mx-auto mb-10 flex justify-between items-center print:hidden">
        <Link to="/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
        </Link>
        <button
          onClick={handlePrint}
          disabled={isExporting}
          className="btn-black flex items-center gap-2 py-2 px-6 text-xs uppercase tracking-widest shadow-xl shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Printer className="h-4 w-4" /> {isExporting ? 'Exporting...' : 'Download PDF'}
        </button>
      </div>

      {/* Resume Paper */}
      <div ref={resumeRef} className="max-w-[800px] mx-auto bg-white shadow-2xl p-12 sm:p-20 min-h-[1056px] border border-gray-100 print:shadow-none print:border-none print:m-0 print:w-full">
        {/* Header */}
        <header className="border-b-8 border-black pb-10 mb-12">
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-4 leading-[0.8]">{resume.full_name || "Name Needed"}</h1>
          <p className="text-xl text-gray-400 font-bold uppercase tracking-widest mb-6">{resume.title || "Position Title"}</p>

          <div className="flex flex-wrap gap-y-3 gap-x-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
            {resume.email && <div className="flex items-center gap-2 border-r border-gray-100 pr-8 last:border-0"><Mail className="h-3 w-3" /> {resume.email}</div>}
            {resume.phone && <div className="flex items-center gap-2 border-r border-gray-100 pr-8 last:border-0"><Phone className="h-3 w-3" /> {resume.phone}</div>}
            {resume.address && <div className="flex items-center gap-2 last:border-0"><MapPin className="h-3 w-3" /> {resume.address}</div>}
          </div>

          <div className="flex flex-wrap gap-y-3 gap-x-8 text-[10px] font-black uppercase tracking-widest text-black mt-4">
            {resume.linkedin && <a href={resume.linkedin} target="_blank" className="flex items-center gap-2 hover:underline"><Target className="h-3 w-3" /> LinkedIn</a>}
            {resume.website && <a href={resume.website} target="_blank" className="flex items-center gap-2 hover:underline"><Globe className="h-3 w-3" /> Portfolio</a>}
          </div>
        </header>

        {/* Content */}
        <div className="space-y-12">
          {/* Summary */}
          {resume.summary && (
            <section>
              <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-4 border-l-4 border-black pl-4">Professional Summary</h2>
              <p className="text-gray-600 leading-relaxed text-sm font-medium whitespace-pre-wrap">{resume.summary}</p>
            </section>
          )}

          {/* Experience */}
          {resume.experience?.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-6 border-l-4 border-black pl-4">Experience</h2>
              <div className="space-y-10">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="relative pl-1">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-md font-black text-black tracking-tight uppercase">{exp.position}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{exp.start_date} — {exp.end_date || (exp.current_job ? 'Present' : '')}</span>
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{exp.company}</p>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {resume.skills?.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-6 border-l-4 border-black pl-4">Skills & Tools</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {resume.skills.map((sk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">
                      {sk.skill_name} <span className="text-gray-300 ml-1">[{sk.proficiency}]</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {resume.education?.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-6 border-l-4 border-black pl-4">Education</h2>
              <div className="space-y-6">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-black text-black uppercase tracking-tight">{edu.institution}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{edu.start_date} — {edu.end_date}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{edu.degree} in {edu.field_of_study}</p>
                    {edu.gpa && <p className="text-[10px] font-black text-black mt-1 uppercase tracking-widest">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects?.length > 0 && (
            <section>
              <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-6 border-l-4 border-black pl-4">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {resume.projects.map((proj, i) => (
                  <div key={i} className="p-6 bg-gray-50/50 border border-gray-100 rounded-2xl relative group hover:bg-black hover:text-white transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-black text-sm uppercase tracking-tight">{proj.project_name}</h3>
                      {proj.url && <a href={proj.url} target="_blank"><ExternalLink className="h-3 w-3 opacity-30 group-hover:opacity-100" /></a>}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-50">{proj.technologies}</p>
                    <p className="text-xs font-medium leading-relaxed opacity-70 group-hover:opacity-100 line-clamp-3">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 opacity-70">
            <img
              src="/brand/resume-logo.png"
              alt="ResumE logo"
              className="w-7 h-7 object-contain"
            />
            <span className="text-sm font-bold tracking-tight text-gray-400">
              Resum<span className="font-black text-base leading-none">E</span>
            </span>
          </div>
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.5em]">Ready to Print &bull; ResumE Platform</p>
        </footer>
      </div>
    </div>
  );
};

export default ResumePreview;
