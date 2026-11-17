import { isLogado } from '../manage/ibe_logged-service';

// Emergency look in Home page.
let srcHeader = $('.ibe-header__logo-img').attr('src');
if (!srcHeader) {
  srcHeader = $('.ibe-header-new__logo-img').attr('src');
}

