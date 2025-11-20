import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw, FileText, Edit3, X } from 'lucide-react';
import { VideoProgress, VideoNote } from '../types';

interface VideoTutorialProps {
  videoId: string;
  title: string;
  description?: string;
  videoUrl: string;
  transcript: TranscriptSegment[];
  onProgressUpdate?: (progress: VideoProgress) => void;
}

interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export const VideoTutorial: React.FC<VideoTutorialProps> = ({
  videoId,
  title,
  description,
  videoUrl,
  transcript,
  onProgressUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTranscriptId, setActiveTranscriptId] = useState<string | null>(null);
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`video_notes_${videoId}`);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }
  }, [videoId]);

  // Save notes to localStorage
  const saveNotesToStorage = useCallback((notesToSave: VideoNote[]) => {
    try {
      localStorage.setItem(`video_notes_${videoId}`, JSON.stringify(notesToSave));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }, [videoId]);

  // Video event handlers
  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Find active transcript segment
      const activeSegment = transcript.find(
        (segment) => time >= segment.startTime && time <= segment.endTime
      );
      setActiveTranscriptId(activeSegment?.id || null);

      // Update progress
      if (duration > 0 && onProgressUpdate) {
        const progress: VideoProgress = {
          videoId,
          currentTime: time,
          duration,
          completed: time / duration > 0.9,
          watchedPercentage: (time / duration) * 100,
        };
        onProgressUpdate(progress);
      }
    }
  }, [videoId, duration, transcript, onProgressUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && videoRef.current?.parentElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const restartVideo = useCallback(() => {
    handleSeek(0);
    handlePlay();
  }, [handleSeek, handlePlay]);

  // Notes functionality
  const addNote = useCallback(() => {
    if (newNote.trim()) {
      const note: VideoNote = {
        id: Date.now().toString(),
        videoId,
        timestamp: currentTime,
        content: newNote.trim(),
        createdAt: new Date(),
      };
      
      const updatedNotes = [...notes, note].sort((a, b) => a.timestamp - b.timestamp);
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setNewNote('');
      setIsAddingNote(false);
    }
  }, [newNote, videoId, currentTime, notes, saveNotesToStorage]);

  const deleteNote = useCallback((noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  }, [notes, saveNotesToStorage]);

  const updateNote = useCallback((noteId: string, newContent: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, content: newContent } : note
    );
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    setEditingNoteId(null);
  }, [notes, saveNotesToStorage]);

  const jumpToNoteTime = useCallback((timestamp: number) => {
    handleSeek(timestamp);
    handlePlay();
  }, [handleSeek, handlePlay]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-3">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={videoUrl} type="video/mp4" />
              <track
                kind="captions"
                src="/captions.vtt"
                srcLang="en"
                label="English"
                default
              />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="relative w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Seek video position"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={restartVideo}
                    className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Restart video"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      aria-label="Volume control"
                    />
                  </div>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="mt-6 card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Transcript
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transcript.map((segment) => (
                <button
                  key={segment.id}
                  onClick={() => handleSeek(segment.startTime)}
                  className={`block w-full text-left p-3 rounded-lg transition-colors ${
                    activeTranscriptId === segment.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm text-gray-500 block">
                    {formatTime(segment.startTime)}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {segment.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Edit3 className="h-5 w-5 mr-2" />
                Notes
              </h3>
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="btn btn-primary text-xs px-3 py-1"
                aria-label="Add note"
              >
                Add Note
              </button>
            </div>

            {/* Add Note Form */}
            {isAddingNote && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">
                  Note at {formatTime(currentTime)}
                </div>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add your note..."
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  autoFocus
                />
                <div className="flex items-center justify-end space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote('');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="btn btn-primary text-xs px-3 py-1 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No notes yet. Add your first note!
                </p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => jumpToNoteTime(note.timestamp)}
                        className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {formatTime(note.timestamp)}
                      </button>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingNoteId(note.id)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label="Edit note"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-gray-500 hover:text-red-500"
                          aria-label="Delete note"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    {editingNoteId === note.id ? (
                      <EditNoteForm
                        note={note}
                        onSave={updateNote}
                        onCancel={() => setEditingNoteId(null)}
                      />
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {note.content}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit Note Form Component
interface EditNoteFormProps {
  note: VideoNote;
  onSave: (noteId: string, content: string) => void;
  onCancel: () => void;
}

const EditNoteForm: React.FC<EditNoteFormProps> = ({ note, onSave, onCancel }) => {
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    if (content.trim()) {
      onSave(note.id, content.trim());
    }
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        rows={3}
        autoFocus
      />
      <div className="flex items-center justify-end space-x-2 mt-2">
        <button
          onClick={onCancel}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};