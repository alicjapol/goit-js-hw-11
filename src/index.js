import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const apiKey = '41180761-f0899a94a2e54aea5b2403dd8';
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;

gallery.style.display = 'none';

const fetchImg = async (currentPage) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

loadMore.addEventListener('click', () => {
  fetchAndRenderImg(++page);
});

const fetchAndRenderImg = async (currentPage) => {
  try {
    const images = await fetchImg(currentPage);
    clearGallery();

    if (images.length > 0) {

      images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.largeImageURL;
        imgElement.alt = image.tags;
        gallery.appendChild(imgElement);
        gallery.style.display = 'block';

      });
    } else {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
};

fetchAndRenderImg(page);

form.addEventListener('submit', async e => {
  e.preventDefault();
  page = 1;
  fetchAndRenderImg(page);
});

function clearGallery() {
  gallery.innerHTML = '';
}
