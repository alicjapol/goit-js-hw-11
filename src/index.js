const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const apiKey = '41180761-f0899a94a2e54aea5b2403dd8';
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;

gallery.style.visibility = 'hidden';

const fetchImg = async (currentPage) => {
  const searchParams = new URLSearchParams({
    key: apiKey,
    q: input.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40
  });

  const response = await axios.get(
    `https://pixabay.com/api/?${searchParams}`
  );
  const images = response.data.hits; 

  if (images.length === 0) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  return images.map(image => ({
    webformatURL: image.webformatURL,
    largeImageURL: image.largeImageURL,
    tags: image.tags,
    likes: image.likes,
    views: image.views,
    comments: image.comments,
    downloads: image.downloads,
  }));
};

loadMore.addEventListener('click', () => {
  fetchAndRenderImg(++page);
});

const fetchAndRenderImg = async (currentPage) => {
  const images = await fetchImg(currentPage);
  clearGallery();

  if (images.length > 0) {
    gallery.style.visibility = 'visible';
    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.largeImageURL;
      imgElement.alt = image.tags;
      gallery.appendChild(imgElement);
    });
  } else {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }
};

const clearGallery = () => {
  gallery.innerHTML = '';
};
