import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { Link } from 'preact-router';
import { getServiceById, getServiceReviews } from '../api/services';

const ServiceDetail = (props) => {
  const { id } = props;
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        const serviceData = await getServiceById(id);
        setService(serviceData);

        const reviewsData = await getServiceReviews(id);
        setReviews(reviewsData.reviews || []);

        setError(null);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to load service details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  // Scroll to modal when it appears
  useEffect(() => {
    if (showReviewModal && modalRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        modalRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [showReviewModal]);

  const getDefaultImage = () => {
    return `https://picsum.photos/seed/service-${id}/800/500`;
  };

  const nextImage = () => {
    if (service?.media && service.media.length > 0) {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % service.media.length);
    }
  };

  const prevImage = () => {
    if (service?.media && service.media.length > 0) {
      setActiveImageIndex((prevIndex) => (prevIndex - 1 + service.media.length) % service.media.length);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Price on request';
    return `$${price}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }
    
    setReviewSubmitting(true);
    
    try {
      // This would make an actual API call in a real implementation
      // For demo purposes, we're just simulating success and adding to the local state
      const newReview = {
        id: Date.now(), // Temporary ID
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString(),
        user: { username: "Demo User" }
      };
      
      setReviews(prev => [newReview, ...prev]);
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewComment('');
      
      // Success message
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Failed to submit review. Please try again.");
      console.error("Error submitting review:", error);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewComment('');
  };

  if (loading) {
    return (
      <div class="flex justify-center items-center h-screen">
        <div class="w-16 h-16 border-4 border-[#FFDC7F] border-t-[#16325B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="min-h-screen bg-gray-100 flex justify-center items-center">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p class="text-gray-700">{error}</p>
          <Link href="/explore" class="inline-block mt-6 bg-[#16325B] hover:bg-blue-800 text-white py-2 px-6 rounded">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div class="min-h-screen bg-gray-100 flex justify-center items-center">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 class="text-2xl font-bold text-[#16325B] mb-4">Service Not Found</h2>
          <p class="text-gray-700">The service you are looking for doesn't exist or has been removed.</p>
          <Link href="/explore" class="inline-block mt-6 bg-[#16325B] hover:bg-blue-800 text-white py-2 px-6 rounded">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const hasMedia = service.media && service.media.length > 0;
  const currentImage = hasMedia ? service.media[activeImageIndex] : null;
  const imageUrl = currentImage?.url || service.featuredMedia?.url || getDefaultImage();

  return (
    <div class="min-h-screen bg-gray-100">
      <div class="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div class="mb-6">
          <div class="flex items-center text-sm text-gray-500">
            <Link href="/explore" class="hover:text-[#227B94]">Explore</Link>
            <span class="mx-2">/</span>
            <span class="text-gray-700">{service.title}</span>
          </div>
        </div>

        {/* Service Header */}
        <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Image Gallery */}
          <div class="relative h-96">
            <img 
              src={imageUrl} 
              alt={currentImage?.caption || service.title} 
              class="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDefaultImage();
              }}
            />
            
            {hasMedia && service.media.length > 1 && (
              <div class="absolute inset-0 flex items-center justify-between">
                <button 
                  onClick={prevImage} 
                  class="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full ml-4 focus:outline-none"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage} 
                  class="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full mr-4 focus:outline-none"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Category Badge */}
            {service.category && (
              <div class="absolute top-4 right-4">
                <span class="bg-[#FFDC7F] text-[#16325B] text-sm font-bold px-3 py-1 rounded-full">
                  {service.category.name}
                </span>
              </div>
            )}

            {/* Image Counter */}
            {hasMedia && service.media.length > 1 && (
              <div class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                {activeImageIndex + 1} / {service.media.length}
              </div>
            )}
          </div>

          {/* Service Details */}
          <div class="p-6">
            <div class="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-[#16325B]">{service.title}</h1>
                <div class="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-600">
                    {service.averageRating ? `${service.averageRating} (${service.reviewCount} reviews)` : 'No ratings yet'}
                  </span>
                </div>
              </div>
              <div class="mt-4 md:mt-0">
                <div class="text-3xl font-bold text-[#16325B]">{formatPrice(service.price)}</div>
                <div class="text-gray-500 text-sm">per person</div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#227B94] mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{service.location || 'Worldwide'}</span>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#227B94] mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{service.duration ? `${service.duration} days` : 'Flexible duration'}</span>
              </div>
              {service.agency && (
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#227B94] mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1v1a1 1 0 11-2 0v-1H7v1a1 1 0 11-2 0v-1a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-700">By {service.agency.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-[#16325B] mb-4">Description</h2>
              <p class="text-gray-700 whitespace-pre-line">{service.description}</p>
            </div>

            {/* Itinerary */}
            {service.itinerary && (
              <div class="mb-8">
                <h2 class="text-xl font-semibold text-[#16325B] mb-4">Itinerary</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700 whitespace-pre-line">{service.itinerary}</p>
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {service.inclusions && (
                <div>
                  <h2 class="text-xl font-semibold text-[#16325B] mb-4">Inclusions</h2>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-700 whitespace-pre-line">{service.inclusions}</p>
                  </div>
                </div>
              )}
              {service.exclusions && (
                <div>
                  <h2 class="text-xl font-semibold text-[#16325B] mb-4">Exclusions</h2>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-700 whitespace-pre-line">{service.exclusions}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            {service.terms && (
              <div class="mb-8">
                <h2 class="text-xl font-semibold text-[#16325B] mb-4">Terms & Conditions</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700 whitespace-pre-line">{service.terms}</p>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div class="mt-8 flex justify-center">
              <button class="bg-[#16325B] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                Book This Trip
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold text-[#16325B]">Reviews</h2>
            <button 
              onClick={openReviewModal}
              class="bg-[#FFDC7F] hover:bg-yellow-400 text-[#16325B] font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Add Review
            </button>
          </div>
          
          {reviews.length === 0 ? (
            <div>
              <div class="mb-4 text-gray-500 italic">
                No actual reviews yet for this service. Here's a preview of how reviews will appear:
              </div>
              <div class="border-b border-gray-200 pb-6">
                <div class="flex justify-between mb-2">
                  <div class="font-medium">Demo User</div>
                  <div class="text-gray-500 text-sm">{formatDate(new Date())}</div>
                </div>
                <div class="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      class={`h-5 w-5 ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p class="text-gray-700">This is a sample review showing what actual customer feedback will look like. The actual service hasn't been reviewed yet.</p>
              </div>
            </div>
          ) : (
            <div class="space-y-6">
              {reviews.map(review => (
                <div key={review.id} class="border-b border-gray-200 pb-6 last:border-b-0">
                  <div class="flex justify-between mb-2">
                    <div class="font-medium">{review.user?.username || 'Anonymous'}</div>
                    <div class="text-gray-500 text-sm">{formatDate(review.createdAt)}</div>
                  </div>
                  <div class="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        xmlns="http://www.w3.org/2000/svg" 
                        class={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p class="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Explore */}
        <div class="flex justify-center">
          <Link href="/explore" class="inline-block bg-gray-200 hover:bg-gray-300 text-[#16325B] font-semibold py-2 px-6 rounded-lg transition duration-300">
            Back to Explore
          </Link>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div ref={modalRef} class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-300">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-[#16325B]">Write a Review</h3>
              <button 
                onClick={closeReviewModal}
                class="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="mb-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              Note: In a real app, this would require you to have completed a booking for this service.
            </div>
            
            <form onSubmit={handleSubmitReview}>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-medium mb-2">Your Rating</label>
                <div class="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      class="focus:outline-none"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        class={`h-8 w-8 ${i < reviewRating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <p class="text-sm text-gray-500 mt-1">
                    {reviewRating === 1 ? 'Poor' : 
                     reviewRating === 2 ? 'Fair' :
                     reviewRating === 3 ? 'Good' :
                     reviewRating === 4 ? 'Very Good' : 'Excellent'}
                  </p>
                )}
              </div>
              
              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-medium mb-2" for="comment">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Share your experience with this service..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div class="flex justify-end">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg mr-2"
                  disabled={reviewSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="bg-[#16325B] hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? (
                    <>
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail; 