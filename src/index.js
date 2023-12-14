import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import $ from 'jquery';

const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const apiKey = '41180761-f0899a94a2e54aea5b2403dd8';
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;

loadMore.hidden = true;

const fetchImg = async currentPage => {
  try {
    const searchParams = new URLSearchParams({
      key: apiKey,
      q: input.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: 40,
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

const fetchAndRenderImg = async currentPage => {
  try {
    const images = await fetchImg(currentPage);
    gallery.innerHTML += images
      .map(
        item => `
        <div class="photo-card">
          <a href="${item.largeImageURL}" data-lightbox="gallery">
            <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${item.likes}</p>
            <p class="info-item"><b>Views:</b> ${item.views}</p>
            <p class="info-item"><b>Comments:</b> ${item.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${item.downloads}</p>
          </div>
        </div>
      `
      )
      .join('');

    const lightbox = new SimpleLightbox('.gallery a');
    loadMore.hidden = false;

    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  fetchAndRenderImg(page);
  scrollSmoothly();
});

function scrollSmoothly() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >
    document.documentElement.scrollHeight
  ) {
    page++;
    fetchAndRenderImg(page);
  }
});
