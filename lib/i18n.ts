export type Lang =
  | "en"
  | "tr"
  | "de"
  | "fr"
  | "es"
  | "ru"
  | "zh"
  | "ar"
  | "pt"
  | "it"
  | "ja";

export const LANGS: Array<{ code: Lang; label: string }> = [
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "ru", label: "RU" },
  { code: "pt", label: "PT" },
  { code: "it", label: "IT" },
  { code: "ja", label: "JA" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "AR" },
];

export const DICT = {
  en: {
    // Navbar
    nav_features: "Features",
    nav_pricing: "Pricing",
    nav_docs: "Docs",
    nav_dashboard: "Dashboard",
    nav_login: "Log in",
    nav_compress: "Compress Images",

    // Landing
    hero_badge: "AI‑Powered Compression Engine",
    hero_title: "Compress images without losing quality",
    hero_subtitle:
      "Reduce image file size up to 90% with AI‑powered compression. Supports JPG, PNG, WebP, and AVIF. Free to start.",
    hero_cta_primary: "Compress Images Now",
    hero_cta_secondary: "See How It Works",

    features_title: "Everything you need to optimize images",
    features_subtitle:
      "Built for developers, designers, and teams who need fast, reliable image compression at scale.",

    feature_fast_title: "Lightning Fast",
    feature_fast_desc:
      "Compress images in seconds with an optimized engine. Batch process multiple files at once.",
    feature_formats_title: "Multi‑Format Support",
    feature_formats_desc:
      "JPG, PNG, WebP, AVIF and more. Auto‑detect and optimize each format.",
    feature_quality_title: "Lossless‑looking Quality",
    feature_quality_desc:
      "Perceptual compression that preserves visual quality while shrinking file size.",
    feature_batch_title: "Batch Processing",
    feature_batch_desc:
      "Upload and compress many images at once. Perfect for teams and large projects.",
    feature_api_title: "API Access",
    feature_api_desc:
      "Integrate ZipPixel into your workflow with a simple REST API (coming with keys in Settings).",
    feature_secure_title: "Secure & Private",
    feature_secure_desc:
      "Encrypted in transit. Files are automatically removed after processing.",

    faq_title: "Frequently asked questions",
    faq_subtitle: "Quick answers about compression, formats, privacy, and limits.",

    cta_title: "Ship faster pages with smaller images",
    cta_subtitle: "Start free, upgrade when you need more volume.",
    cta_button: "Start Compressing",

    // Compress page
    compress_h1: "Compress images online",
    compress_p:
      "Reduce image file size up to 90% without losing quality. AI‑powered compression for JPG, PNG, WebP, and AVIF.",

    // Upload zone
    upload_drop: "Drop images here to compress",
    upload_browse: "Browse Files",
    upload_supports: "or click to browse. Supports JPG, PNG, WebP, AVIF.",
    quality: "Quality",
    output_format: "Output Format",
    auto_best: "Auto (Best format)",
    mode: "Mode",
    mode_fast: "Fast",
    mode_balanced: "Balanced",
    mode_ultra: "Ultra",
    results: "Results",
    clear: "Clear",
    download_all: "Download All",
    file: "File",
    original: "Original",
    compressed: "Compressed",
    savings: "Savings",
    status: "Status",
    download: "Download",
    working: "Working",
    done: "Done",
    no_files: "No files yet.",
    limit_reached_title: "Monthly limit reached",
    limit_reached_desc: "Upgrade your plan to continue compressing this month.",
    err_too_large:
      "File too large for upload. Please upload a smaller file or upgrade your plan.",
    err_generic: "Compression failed.",

    // Support widget
    support_button: "Help",
    support_title: "Need a hand?",
    support_desc:
      "Tell us what you need. You can report a bug or contact support. (Email hookup coming soon.)",
    support_contact: "Contact support",
    support_report: "Report an issue",
    support_close: "Close",

    // Dashboard / Settings
    settings_title: "Settings",
    settings_desc: "Manage your account and preferences.",
    admin: "Admin",
  },

  tr: {
    nav_features: "Özellikler",
    nav_pricing: "Fiyatlandırma",
    nav_docs: "Doküman",
    nav_dashboard: "Panel",
    nav_login: "Giriş",
    nav_compress: "Görsel Sıkıştır",

    hero_badge: "Yapay Zekâ Destekli Sıkıştırma Motoru",
    hero_title: "Kaliteyi bozmadan görselleri sıkıştır",
    hero_subtitle:
      "Yapay zekâ destekli sıkıştırma ile dosya boyutunu %90'a kadar düşür. JPG, PNG, WebP ve AVIF destekler. Ücretsiz başla.",
    hero_cta_primary: "Hemen Sıkıştır",
    hero_cta_secondary: "Nasıl Çalışır?",

    features_title: "Görsel optimizasyonu için ihtiyacın olan her şey",
    features_subtitle:
      "Hızlı, güvenilir ve ölçeklenebilir sıkıştırma isteyen geliştiriciler, tasarımcılar ve ekipler için.",

    feature_fast_title: "Işık Hızında",
    feature_fast_desc:
      "Optimize motor ile saniyeler içinde sıkıştır. Birden fazla dosyayı toplu işle.",
    feature_formats_title: "Çoklu Format Desteği",
    feature_formats_desc:
      "JPG, PNG, WebP, AVIF ve daha fazlası. Her formatı otomatik algılar ve optimize eder.",
    feature_quality_title: "Kaliteyi Korur",
    feature_quality_desc:
      "Görsel kaliteyi koruyan algısal sıkıştırma ile dosya boyutunu ciddi azaltır.",
    feature_batch_title: "Toplu İşleme",
    feature_batch_desc:
      "Bir seferde birden çok görsel yükle ve sıkıştır. Büyük işler için ideal.",
    feature_api_title: "API Erişimi",
    feature_api_desc:
      "REST API ile iş akışına entegre et (anahtarlar Ayarlar'dan yönetilir).",
    feature_secure_title: "Güvenli & Özel",
    feature_secure_desc:
      "Aktarım sırasında şifreleme. Dosyalar işlem sonrası otomatik silinir.",

    faq_title: "Sık sorulan sorular",
    faq_subtitle: "Sıkıştırma, formatlar, gizlilik ve limitler hakkında kısa cevaplar.",

    cta_title: "Daha küçük görsellerle daha hızlı sayfalar",
    cta_subtitle: "Ücretsiz başla, ihtiyacın olunca yükselt.",
    cta_button: "Sıkıştırmaya Başla",

    compress_h1: "Görselleri çevrimiçi sıkıştır",
    compress_p:
      "Kalite kaybı olmadan dosya boyutunu %90'a kadar düşür. JPG, PNG, WebP ve AVIF için yapay zekâ destekli sıkıştırma.",

    upload_drop: "Sıkıştırmak için görselleri buraya bırak",
    upload_browse: "Dosya Seç",
    upload_supports: "ya da tıklayıp seç. JPG, PNG, WebP, AVIF destekler.",
    quality: "Kalite",
    output_format: "Çıktı Formatı",
    auto_best: "Otomatik (En iyi)",
    mode: "Mod",
    mode_fast: "Hızlı",
    mode_balanced: "Dengeli",
    mode_ultra: "Ultra",
    results: "Sonuçlar",
    clear: "Temizle",
    download_all: "Tümünü İndir",
    file: "Dosya",
    original: "Orijinal",
    compressed: "Sıkıştırılmış",
    savings: "Kazanç",
    status: "Durum",
    download: "İndir",
    working: "İşleniyor",
    done: "Bitti",
    no_files: "Henüz dosya yok.",
    limit_reached_title: "Aylık limit doldu",
    limit_reached_desc: "Bu ay devam etmek için planını yükselt.",
    err_too_large:
      "Dosya çok büyük. Daha küçük bir dosya yükle veya planını yükselt.",
    err_generic: "Sıkıştırma başarısız.",

    support_button: "Destek",
    support_title: "Yardım mı lazım?",
    support_desc:
      "İhtiyacını yaz. Hata bildirimi veya destek mesajı bırakabilirsin. (E‑posta bağlantısı yakında.)",
    support_contact: "Destek ekibi",
    support_report: "Hata bildir",
    support_close: "Kapat",

    settings_title: "Ayarlar",
    settings_desc: "Hesabını ve tercihlerini yönet.",
    admin: "Admin",
  },

  de: {
    nav_features: "Funktionen",
    nav_pricing: "Preise",
    nav_docs: "Docs",
    nav_dashboard: "Dashboard",
    nav_login: "Anmelden",
    nav_compress: "Bilder komprimieren",

    hero_badge: "KI‑Kompressions‑Engine",
    hero_title: "Bilder komprimieren ohne Qualitätsverlust",
    hero_subtitle:
      "Reduziere die Dateigröße um bis zu 90% mit KI‑Komprimierung. Unterstützt JPG, PNG, WebP und AVIF. Kostenlos starten.",
    hero_cta_primary: "Jetzt komprimieren",
    hero_cta_secondary: "So funktioniert’s",

    features_title: "Alles für perfekte Bild‑Optimierung",
    features_subtitle:
      "Für Entwickler, Designer und Teams, die schnelle, zuverlässige Komprimierung brauchen.",

    feature_fast_title: "Blitzschnell",
    feature_fast_desc:
      "Komprimiere in Sekunden. Verarbeite mehrere Dateien im Batch.",
    feature_formats_title: "Viele Formate",
    feature_formats_desc:
      "JPG, PNG, WebP, AVIF und mehr. Automatische Erkennung und Optimierung.",
    feature_quality_title: "Qualität bleibt sichtbar gleich",
    feature_quality_desc:
      "Perzeptuelle Komprimierung: kleiner, ohne sichtbare Einbußen.",
    feature_batch_title: "Batch‑Verarbeitung",
    feature_batch_desc:
      "Viele Bilder auf einmal hochladen und komprimieren – ideal für große Projekte.",
    feature_api_title: "API‑Zugriff",
    feature_api_desc:
      "REST API für Workflows (Keys in den Einstellungen).",
    feature_secure_title: "Sicher & Privat",
    feature_secure_desc:
      "Verschlüsselt in Transit. Dateien werden nach dem Processing gelöscht.",

    faq_title: "FAQ",
    faq_subtitle: "Antworten zu Formaten, Datenschutz und Limits.",

    cta_title: "Schnellere Seiten mit kleineren Bildern",
    cta_subtitle: "Kostenlos starten, später upgraden.",
    cta_button: "Komprimieren starten",

    compress_h1: "Bilder online komprimieren",
    compress_p:
      "Reduziere die Dateigröße ohne sichtbaren Qualitätsverlust. KI‑Komprimierung für JPG, PNG, WebP und AVIF.",

    upload_drop: "Bilder hier ablegen",
    upload_browse: "Dateien auswählen",
    upload_supports: "oder klicken. Unterstützt JPG, PNG, WebP, AVIF.",
    quality: "Qualität",
    output_format: "Ausgabeformat",
    auto_best: "Auto (Bestes)",
    mode: "Modus",
    mode_fast: "Schnell",
    mode_balanced: "Ausgewogen",
    mode_ultra: "Ultra",
    results: "Ergebnisse",
    clear: "Leeren",
    download_all: "Alle herunterladen",
    file: "Datei",
    original: "Original",
    compressed: "Komprimiert",
    savings: "Ersparnis",
    status: "Status",
    download: "Download",
    working: "Verarbeitung",
    done: "Fertig",
    no_files: "Noch keine Dateien.",
    limit_reached_title: "Monatslimit erreicht",
    limit_reached_desc: "Upgrade, um diesen Monat weiter zu komprimieren.",
    err_too_large: "Datei zu groß. Bitte kleinere Datei hochladen oder upgraden.",
    err_generic: "Komprimierung fehlgeschlagen.",

    support_button: "Hilfe",
    support_title: "Brauchst du Hilfe?",
    support_desc:
      "Melde ein Problem oder kontaktiere Support. (E‑Mail‑Anbindung folgt.)",
    support_contact: "Support kontaktieren",
    support_report: "Problem melden",
    support_close: "Schließen",

    settings_title: "Einstellungen",
    settings_desc: "Konto und Präferenzen verwalten.",
    admin: "Admin",
  },

  fr: {
    nav_features: "Fonctionnalités",
    nav_pricing: "Tarifs",
    nav_docs: "Docs",
    nav_dashboard: "Dashboard",
    nav_login: "Connexion",
    nav_compress: "Compresser",

    hero_badge: "Moteur de compression IA",
    hero_title: "Compressez vos images sans perdre en qualité",
    hero_subtitle:
      "Réduisez la taille jusqu’à 90% grâce à l’IA. JPG, PNG, WebP et AVIF. Gratuit pour commencer.",
    hero_cta_primary: "Compresser maintenant",
    hero_cta_secondary: "Voir comment ça marche",

    features_title: "Tout ce qu’il faut pour optimiser vos images",
    features_subtitle:
      "Pour les développeurs, designers et équipes qui veulent une compression rapide et fiable.",

    feature_fast_title: "Ultra rapide",
    feature_fast_desc:
      "Compression en quelques secondes. Traitement par lots de plusieurs fichiers.",
    feature_formats_title: "Multi‑formats",
    feature_formats_desc:
      "JPG, PNG, WebP, AVIF et plus. Détection et optimisation automatiques.",
    feature_quality_title: "Qualité préservée",
    feature_quality_desc:
      "Compression perceptuelle: taille réduite sans différence visible.",
    feature_batch_title: "Traitement par lots",
    feature_batch_desc:
      "Téléversez et compressez plusieurs images en une seule fois.",
    feature_api_title: "Accès API",
    feature_api_desc:
      "REST API pour vos workflows (clés dans les paramètres).",
    feature_secure_title: "Sécurisé & privé",
    feature_secure_desc:
      "Chiffré en transit. Suppression automatique après traitement.",

    faq_title: "Questions fréquentes",
    faq_subtitle: "Compression, formats, confidentialité et limites.",

    cta_title: "Des pages plus rapides grâce à des images plus légères",
    cta_subtitle: "Commencez gratuitement, passez au niveau supérieur plus tard.",
    cta_button: "Commencer",

    compress_h1: "Compresser des images en ligne",
    compress_p:
      "Réduisez la taille sans perte visible. Compression IA pour JPG, PNG, WebP et AVIF.",

    upload_drop: "Déposez vos images ici",
    upload_browse: "Choisir des fichiers",
    upload_supports: "ou cliquez. JPG, PNG, WebP, AVIF.",
    quality: "Qualité",
    output_format: "Format de sortie",
    auto_best: "Auto (Meilleur)",
    mode: "Mode",
    mode_fast: "Rapide",
    mode_balanced: "Équilibré",
    mode_ultra: "Ultra",
    results: "Résultats",
    clear: "Effacer",
    download_all: "Tout télécharger",
    file: "Fichier",
    original: "Original",
    compressed: "Compressé",
    savings: "Gain",
    status: "Statut",
    download: "Télécharger",
    working: "Traitement",
    done: "Terminé",
    no_files: "Aucun fichier.",
    limit_reached_title: "Limite mensuelle atteinte",
    limit_reached_desc: "Mettez à niveau pour continuer ce mois‑ci.",
    err_too_large: "Fichier trop volumineux. Téléversez plus petit ou mettez à niveau.",
    err_generic: "Échec de la compression.",

    support_button: "Aide",
    support_title: "Besoin d’aide?",
    support_desc:
      "Contactez le support ou signalez un bug. (E‑mail bientôt.)",
    support_contact: "Contacter le support",
    support_report: "Signaler un problème",
    support_close: "Fermer",

    settings_title: "Paramètres",
    settings_desc: "Gérez votre compte et vos préférences.",
    admin: "Admin",
  },

  es: {
    nav_features: "Características",
    nav_pricing: "Precios",
    nav_docs: "Docs",
    nav_dashboard: "Panel",
    nav_login: "Iniciar sesión",
    nav_compress: "Comprimir",

    hero_badge: "Motor de compresión con IA",
    hero_title: "Comprime imágenes sin perder calidad",
    hero_subtitle:
      "Reduce el tamaño hasta un 90% con IA. Compatible con JPG, PNG, WebP y AVIF. Gratis para empezar.",
    hero_cta_primary: "Comprimir ahora",
    hero_cta_secondary: "Ver cómo funciona",

    features_title: "Todo lo que necesitas para optimizar imágenes",
    features_subtitle:
      "Para desarrolladores, diseñadores y equipos que necesitan compresión rápida y fiable.",

    feature_fast_title: "Muy rápido",
    feature_fast_desc:
      "Compresión en segundos. Procesa varios archivos por lote.",
    feature_formats_title: "Soporte multi‑formato",
    feature_formats_desc:
      "JPG, PNG, WebP, AVIF y más. Detección y optimización automática.",
    feature_quality_title: "Calidad preservada",
    feature_quality_desc:
      "Compresión perceptual: menor tamaño sin pérdida visible.",
    feature_batch_title: "Procesamiento por lotes",
    feature_batch_desc:
      "Sube y comprime muchas imágenes a la vez.",
    feature_api_title: "Acceso API",
    feature_api_desc:
      "REST API para tu flujo de trabajo (claves en Ajustes).",
    feature_secure_title: "Seguro y privado",
    feature_secure_desc:
      "Cifrado en tránsito. Borrado automático tras el proceso.",

    faq_title: "Preguntas frecuentes",
    faq_subtitle: "Respuestas rápidas sobre formatos, privacidad y límites.",

    cta_title: "Páginas más rápidas con imágenes más pequeñas",
    cta_subtitle: "Empieza gratis y mejora cuando lo necesites.",
    cta_button: "Empezar",

    compress_h1: "Comprimir imágenes online",
    compress_p:
      "Reduce el tamaño sin perder calidad visible. Compresión IA para JPG, PNG, WebP y AVIF.",

    upload_drop: "Suelta imágenes aquí",
    upload_browse: "Elegir archivos",
    upload_supports: "o haz clic. JPG, PNG, WebP, AVIF.",
    quality: "Calidad",
    output_format: "Formato de salida",
    auto_best: "Auto (Mejor)",
    mode: "Modo",
    mode_fast: "Rápido",
    mode_balanced: "Equilibrado",
    mode_ultra: "Ultra",
    results: "Resultados",
    clear: "Limpiar",
    download_all: "Descargar todo",
    file: "Archivo",
    original: "Original",
    compressed: "Comprimido",
    savings: "Ahorro",
    status: "Estado",
    download: "Descargar",
    working: "Procesando",
    done: "Listo",
    no_files: "Sin archivos.",
    limit_reached_title: "Límite mensual alcanzado",
    limit_reached_desc: "Mejora tu plan para seguir este mes.",
    err_too_large: "Archivo demasiado grande. Sube uno menor o mejora tu plan.",
    err_generic: "Falló la compresión.",

    support_button: "Ayuda",
    support_title: "¿Necesitas ayuda?",
    support_desc:
      "Contacta soporte o reporta un problema. (Email pronto.)",
    support_contact: "Contactar soporte",
    support_report: "Reportar problema",
    support_close: "Cerrar",

    settings_title: "Ajustes",
    settings_desc: "Gestiona tu cuenta y preferencias.",
    admin: "Admin",
  },

  ru: {
    nav_features: "Функции",
    nav_pricing: "Цены",
    nav_docs: "Документы",
    nav_dashboard: "Панель",
    nav_login: "Войти",
    nav_compress: "Сжать изображения",

    hero_badge: "ИИ‑движок сжатия",
    hero_title: "Сжимайте изображения без потери качества",
    hero_subtitle:
      "Уменьшайте размер до 90% с помощью ИИ. Поддержка JPG, PNG, WebP и AVIF. Бесплатный старт.",
    hero_cta_primary: "Сжать сейчас",
    hero_cta_secondary: "Как это работает",

    features_title: "Всё для оптимизации изображений",
    features_subtitle:
      "Для разработчиков, дизайнеров и команд, которым нужно быстро и надёжно сжимать изображения.",

    feature_fast_title: "Очень быстро",
    feature_fast_desc:
      "Сжатие за секунды. Пакетная обработка нескольких файлов.",
    feature_formats_title: "Поддержка форматов",
    feature_formats_desc:
      "JPG, PNG, WebP, AVIF и другие. Авто‑оптимизация каждого файла.",
    feature_quality_title: "Качество сохраняется",
    feature_quality_desc:
      "Перцептивное сжатие: меньше размер без заметной разницы.",
    feature_batch_title: "Пакетная обработка",
    feature_batch_desc:
      "Загружайте и сжимайте много изображений за раз.",
    feature_api_title: "API доступ",
    feature_api_desc:
      "REST API для интеграции (ключи в настройках).",
    feature_secure_title: "Безопасно и приватно",
    feature_secure_desc:
      "Шифрование в пути. Авто‑удаление после обработки.",

    faq_title: "Вопросы и ответы",
    faq_subtitle: "Форматы, приватность и лимиты — коротко.",

    cta_title: "Быстрые страницы с меньшими изображениями",
    cta_subtitle: "Начните бесплатно, обновитесь при необходимости.",
    cta_button: "Начать",

    compress_h1: "Сжать изображения онлайн",
    compress_p:
      "Уменьшайте размер без заметной потери качества. ИИ‑сжатие для JPG, PNG, WebP и AVIF.",

    upload_drop: "Перетащите изображения сюда",
    upload_browse: "Выбрать файлы",
    upload_supports: "или нажмите. JPG, PNG, WebP, AVIF.",
    quality: "Качество",
    output_format: "Формат",
    auto_best: "Авто (Лучший)",
    mode: "Режим",
    mode_fast: "Быстро",
    mode_balanced: "Баланс",
    mode_ultra: "Ультра",
    results: "Результаты",
    clear: "Очистить",
    download_all: "Скачать всё",
    file: "Файл",
    original: "Оригинал",
    compressed: "Сжатый",
    savings: "Экономия",
    status: "Статус",
    download: "Скачать",
    working: "Обработка",
    done: "Готово",
    no_files: "Файлов пока нет.",
    limit_reached_title: "Лимит на месяц исчерпан",
    limit_reached_desc: "Обновите план, чтобы продолжить в этом месяце.",
    err_too_large: "Файл слишком большой. Загрузите меньше или обновите план.",
    err_generic: "Сжатие не удалось.",

    support_button: "Помощь",
    support_title: "Нужна помощь?",
    support_desc:
      "Свяжитесь с поддержкой или сообщите о проблеме. (Почта скоро.)",
    support_contact: "Поддержка",
    support_report: "Сообщить о проблеме",
    support_close: "Закрыть",

    settings_title: "Настройки",
    settings_desc: "Управляйте аккаунтом и предпочтениями.",
    admin: "Admin",
  },

  // For the remaining locales we keep a high-quality UI by falling back to English
  // (strings still show correctly; you can extend translations later safely).
  pt: {} as any,
  it: {} as any,
  ja: {} as any,
  zh: {} as any,
  ar: {} as any,
} as const;

export type I18nKey = keyof typeof DICT.en;
