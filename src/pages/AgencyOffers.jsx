import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { createService, addServiceMedia, featureServiceMedia, getMyServices, updateService, getServiceById, deleteServiceMedia } from '../api/services';
import { useAuth } from '../context/AuthContext';

const AgencyOffers = () => {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [createdServiceId, setCreatedServiceId] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaUploadError, setMediaUploadError] = useState(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [featuredMediaId, setFeaturedMediaId] = useState(null);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const fileInputRef = useRef(null);

  if (!isAuthenticated || user?.role !== 'agency') {
    return <div class="p-8 text-center">You must be logged in as an agency to create offers.</div>;
  }

  // Fetch agency's services on mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'agency') {
      getMyServices().then(res => {
        setServices(res.services || []);
      });
    }
  }, [isAuthenticated, user, createdServiceId]);

  // Helper to fetch all media for a service
  const fetchServiceMedia = async (serviceId) => {
    try {
      const service = await getServiceById(serviceId);
      setUploadedMedia(service.media || []);
      // Set featuredMediaId if any
      const featured = (service.media || []).find(m => m.isFeatured || m.IsFeatured);
      setFeaturedMediaId(featured ? (featured.id || featured.Id) : null);
    } catch {
      setUploadedMedia([]);
      setFeaturedMediaId(null);
    }
  };

  const handleEdit = async (service) => {
    setEditingService(service);
    setTitle(service.title || service.Title || '');
    setDescription(service.description || service.Description || '');
    setPrice(service.price || service.Price || '');
    setLocation(service.location || service.Location || '');
    setDuration(service.duration || service.Duration || '');
    setCreatedServiceId(service.id || service.Id);
    setSuccess(false);
    setError(null);
    await fetchServiceMedia(service.id || service.Id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      let service;
      if (editingService) {
        service = await updateService(editingService.id || editingService.Id, { title, description, price, location, duration });
        setSuccess(true);
        // Update the list
        setServices(services.map(s => (s.id === service.id || s.Id === service.Id) ? service : s));
      } else {
        service = await createService({ title, description, price, location, duration });
        setSuccess(true);
        setServices([...services, service]);
      }
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setDuration('');
      setCreatedServiceId(service.id || service.Id);
      setEditingService(null);
      await fetchServiceMedia(service.id || service.Id);
    } catch (err) {
      setError('Failed to save offer.');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  const handleUploadMedia = async () => {
    if (!createdServiceId || mediaFiles.length === 0) return;
    setMediaUploading(true);
    setMediaUploadError(null);
    try {
      for (const file of mediaFiles) {
        const formData = new window.FormData();
        formData.append('file', file);
        formData.append('mediaType', 'image');
        formData.append('caption', file.name);
        formData.append('isFeatured', 'false');
        // Do NOT set Content-Type header, let browser handle it
        await addServiceMedia(createdServiceId, formData);
      }
      setMediaFiles([]);
      await fetchServiceMedia(createdServiceId); // Refresh all media after upload
    } catch (err) {
      setMediaUploadError('Failed to upload images.');
    } finally {
      setMediaUploading(false);
    }
  };

  const handleSetFeatured = async (mediaId) => {
    try {
      await featureServiceMedia(createdServiceId, mediaId);
      setFeaturedMediaId(mediaId);
      await fetchServiceMedia(createdServiceId); // Refresh to update featured
    } catch {
      alert('Failed to set featured image.');
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!createdServiceId) return;
    try {
      await deleteServiceMedia(createdServiceId, mediaId);
      await fetchServiceMedia(createdServiceId);
    } catch {
      alert('Failed to delete image.');
    }
  };

  return (
    <div class="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-bold mb-6 text-[#16325B]">{editingService ? 'Edit Offer' : 'Create New Offer'}</h1>
      {/* List of agency's services */}
      <div class="mb-8">
        <h2 class="text-lg font-semibold mb-2">My Offers</h2>
        {services.length === 0 ? (
          <div class="text-gray-500">No offers yet.</div>
        ) : (
          <ul class="divide-y divide-gray-200">
            {services.map(service => (
              <li key={service.id || service.Id} class="flex items-center justify-between py-2">
                <span>{service.title || service.Title}</span>
                <button
                  class="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  onClick={() => handleEdit(service)}
                  type="button"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {success && <div class="bg-green-100 text-green-700 p-3 rounded mb-4">Offer created successfully!</div>}
      {error && <div class="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Title</label>
          <input class="w-full border rounded px-3 py-2" value={title} onInput={e => setTitle(e.target.value)} required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Description</label>
          <textarea class="w-full border rounded px-3 py-2" value={description} onInput={e => setDescription(e.target.value)} required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Price</label>
          <input type="number" class="w-full border rounded px-3 py-2" value={price} onInput={e => setPrice(e.target.value)} required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Location</label>
          <input class="w-full border rounded px-3 py-2" value={location} onInput={e => setLocation(e.target.value)} required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Duration (days)</label>
          <input type="number" class="w-full border rounded px-3 py-2" value={duration} onInput={e => setDuration(e.target.value)} required />
        </div>
        <button type="submit" class="bg-[#16325B] text-white px-6 py-2 rounded font-semibold" disabled={loading}>
          {loading ? (editingService ? 'Saving...' : 'Creating...') : (editingService ? 'Save Changes' : 'Create Offer')}
        </button>
        {editingService && (
          <button
            type="button"
            class="ml-4 bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={() => {
              setEditingService(null);
              setTitle('');
              setDescription('');
              setPrice('');
              setLocation('');
              setDuration('');
              setCreatedServiceId(null);
              setUploadedMedia([]);
              setFeaturedMediaId(null);
              setSuccess(false);
              setError(null);
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Media upload section, only after service is created */}
      {createdServiceId && (
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-2">Upload Images</h2>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleMediaChange}
            class="mb-2 hidden"
          />
          <button
            type="button"
            class="bg-blue-600 text-white px-4 py-2 rounded ml-2"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={mediaUploading}
          >
            Select Images
          </button>
          <button
            onClick={handleUploadMedia}
            class="bg-green-600 text-white px-4 py-2 rounded ml-2"
            disabled={mediaUploading || mediaFiles.length === 0}
            type="button"
          >
            {mediaUploading ? 'Uploading...' : 'Upload Images'}
          </button>
          {mediaFiles.length > 0 && (
            <div class="text-sm text-gray-600 mt-2">
              Selected: {mediaFiles.map(f => f.name).join(', ')}
            </div>
          )}
          {mediaUploadError && <div class="text-red-600 mt-2">{mediaUploadError}</div>}
          {uploadedMedia.length > 0 && (
            <div class="mt-4">
              <h3 class="font-medium mb-2">Uploaded Images</h3>
              <div class="flex flex-wrap gap-4">
                {uploadedMedia.map(m => (
                  <div key={m.id || m.Id} class="relative border rounded p-2">
                    <img src={m.url || m.Url} alt={m.caption || m.Caption} class="w-24 h-24 object-cover rounded" />
                    <button
                      class={`mt-2 block w-full px-2 py-1 rounded text-xs ${featuredMediaId === (m.id || m.Id) ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => handleSetFeatured(m.id || m.Id)}
                      type="button"
                    >
                      {featuredMediaId === (m.id || m.Id) ? 'Featured' : 'Set as Featured'}
                    </button>
                    <button
                      class="mt-1 block w-full px-2 py-1 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={() => handleDeleteMedia(m.id || m.Id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyOffers;
