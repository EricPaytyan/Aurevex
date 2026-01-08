function currentYear() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
}
currentYear();

// Загрузка JSON-файлов с переводами
const loadLocales = async () => {
  const [en, ru] = await Promise.all([
    fetch('locales/en.json').then(res => res.json()),
    fetch('locales/ru.json').then(res => res.json())
  ]);
  await i18next.init({
    lng: 'en',
    debug: true, // включите для отладки
    resources: {
      en: { translation: en },
      ru: { translation: ru }
    }
  });
  updateContent();
};

// Обновление текста на странице
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = i18next.t(key);
    
    // Специальная обработка для intro.title с HTML
    if (el.getAttribute('data-i18n-html') === 'true') {
      el.innerHTML = translation;
    }
    // Если массив - объединяем через <br>
    else if (Array.isArray(translation)) {
      el.innerHTML = translation.join('<br>');
    } 
    // Обычный текст
    else {
      el.textContent = translation;
    }
  });
}

// Смена языка
function changeLanguage(lang) {
  i18next.changeLanguage(lang, updateContent);
  localStorage.setItem('lang', lang);
}

// При загрузке страницы — восстановить язык
document.addEventListener('DOMContentLoaded', async () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  await loadLocales();
  i18next.changeLanguage(savedLang, updateContent);
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => changeLanguage(btn.dataset.lang));
  });
});