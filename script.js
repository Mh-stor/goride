// مصفوفات البيانات الافتراضية لحماية الموقع في حال كانت الذاكرة فارغة
const defaultVideos = [
    "https://archive.org/download/img-8101_202606/IMG_8098.MP4",
    "https://archive.org/download/img-8101_202606/IMG_8100.MP4",
    "https://archive.org/download/img-8101_202606/IMG_8101.MP4"
];

const defaultServices = [
    { title: "توصيل طعام", desc: "أشهى المأكولات والوجبات الساخنة من مطاعمك المفضلة مباشرة إلى باب بيتك بأعلى سرعة.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400" },
    { title: "توصيل طلبات", desc: "توصيل وشحن الطرود، الهدايا، والمستندات الهامة بسرعة فائقة وأمان مطلق يضمن سلامة شحنتك.", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400" },
    { title: "توصيل ركاب", desc: "رحلات وتوصيل يومي ذكي وآمن مع كباتن محترفين مدربين، متاحين لخدمتك على مدار الساعة.", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400" }
];

const defaultReviews = [
    { name: "سارة أحمد", title: "مخططة رحلات", text: "تجربة رائعة جداً، دقة متناهية وسرعة مذهلة في تلبية الطلبات والتنقل بكفاءة.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" },
    { name: "أحمد علي", title: "مهندس تقني", text: "التطبيق الأفضل للتنقل الداخلي، الأسعار منافسة جداً والتعامل راقٍ للغاية.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" }
];

// دالة التحميل والمزامنة الرئيسية عند فتح الموقع
document.addEventListener("DOMContentLoaded", () => {
    loadDynamicSettings();
    renderServicesGrid();
    renderReviewsGrid();
});

// 1. قراءة وتطبيق الإعدادات الديناميكية والروابط من الـ localStorage
function loadDynamicSettings() {
    // تحديث روابط الفيديوهات للمشغل الذكي
    document.getElementById('main-video').src = localStorage.getItem('gr_video_1') || defaultVideos[0];
    document.getElementById('side-video-1').src = localStorage.getItem('gr_video_2') || defaultVideos[1];
    document.getElementById('side-video-2').src = localStorage.getItem('gr_video_3') || defaultVideos[2];

    // تحديث أسماء وعناوين القائمة العلوية
    document.getElementById('menu-home').innerText = localStorage.getItem('gr_title_home') || "الرئيسية";
    document.getElementById('menu-services').innerText = localStorage.getItem('gr_title_services') || "الخدمات";
    document.getElementById('menu-features').innerText = localStorage.getItem('gr_title_features') || "مميزاتنا";
    document.getElementById('menu-reviews').innerText = localStorage.getItem('gr_title_reviews') || "آراء عملائنا";
    document.getElementById('menu-support').innerText = localStorage.getItem('gr_title_support') || "الدعم والشكاوى";

    // تحديث عناوين الأقسام الرئيسية في الصفحة
    if(document.getElementById('sec-title-services')) document.getElementById('sec-title-services').innerText = localStorage.getItem('gr_title_services') || "الخدمات";
    if(document.getElementById('sec-title-features')) document.getElementById('sec-title-features').innerText = localStorage.getItem('gr_title_features') || "مميزاتنا";
    if(document.getElementById('sec-title-reviews')) document.getElementById('sec-title-reviews').innerText = localStorage.getItem('gr_title_reviews') || "آراء عملائنا";
    if(document.getElementById('sec-title-support')) document.getElementById('sec-title-support').innerText = localStorage.getItem('gr_title_support') || "📥 صندوق الاستفسارات والشكاوى الإلكتروني";

    // تحديث روابط تحميل التطبيق للمتاجر
    document.getElementById('link-apple').href = localStorage.getItem('gr_link_apple') || "https://apps.apple.com/sa/app/go-ride";
    document.getElementById('link-android').href = localStorage.getItem('gr_link_android') || "https://play.google.com/store/apps/details?id=com.goride";

    // [الخاصية الجديدة]: تحديث رابط الخريطة لزر مقر GoRide في الهاتف التفاعلي
    const mapBtn = document.getElementById('hero-map-btn');
    if (mapBtn) {
        mapBtn.href = localStorage.getItem('gr_map_url') || "https://maps.google.com";
    }
}

// 2. تبديل الفيديوهات داخل المشغل التفاعلي ومنع الزوم والتعليق
function swapVideo(panelIndex) {
    const mainVid = document.getElementById('main-video');
    const sideVid1 = document.getElementById('side-video-1');
    const sideVid2 = document.getElementById('side-video-2');

    let currentMain = mainVid.src;

    if (panelIndex === 1) {
        mainVid.src = sideVid1.src;
        sideVid1.src = currentMain;
    } else if (panelIndex === 2) {
        mainVid.src = sideVid2.src;
        sideVid2.src = currentMain;
    }
    
    mainVid.play().catch(err => console.log("تحذير تشغيل تلقائي:", err));
    sideVid1.play().catch(err => console.log(err));
    sideVid2.play().catch(err => console.log(err));
}

// 3. بناء شبكة بطاقات الخدمات برمجياً ديناميكياً
function renderServicesGrid() {
    const grid = document.getElementById('dynamic-services-grid');
    if (!grid) return;
    
    const services = JSON.parse(localStorage.getItem('gr_services_data')) || defaultServices;
    grid.innerHTML = '';

    services.forEach((service, index) => {
        grid.innerHTML += `
            <div class="service-card" onclick="openServiceDetail(${index})">
                <img src="${service.img}" alt="${service.title}" class="service-image">
                <div class="service-content">
                    <h3>${service.title}</h3>
                    <p>${service.desc.substring(0, 75)}...</p>
                    <span class="read-more-btn">عرض التفاصيل ←</span>
                </div>
            </div>
        `;
    });
}

// 4. نافذة عرض تفاصيل الخدمة المنبثقة (Popup)
function openServiceDetail(index) {
    const services = JSON.parse(localStorage.getItem('gr_services_data')) || defaultServices;
    const item = services[index];

    document.getElementById('popup-service-title').innerText = item.title;
    document.getElementById('popup-service-desc').innerText = item.desc;
    document.getElementById('popup-media-box').innerHTML = `<img src="${item.img}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
    
    document.getElementById('service-detail-popup').classList.add('popup-visible');
}

function closeServiceDetail() {
    document.getElementById('service-detail-popup').classList.remove('popup-visible');
}

// 5. بناء شبكة آراء ومراجعات العملاء ديناميكياً
function renderReviewsGrid() {
    const grid = document.getElementById('dynamic-reviews-grid');
    if (!grid) return;

    const reviews = JSON.parse(localStorage.getItem('gr_reviews_data')) || defaultReviews;
    grid.innerHTML = '';

    reviews.forEach(rev => {
        grid.innerHTML += `
            <div class="review-card">
                <p class="review-text">"${rev.text}"</p>
                <div class="reviewer-meta">
                    <img src="${rev.avatar}" alt="${rev.name}" class="reviewer-avatar">
                    <div class="reviewer-info">
                        <h4>${rev.name}</h4>
                        <small>${rev.title}</small>
                    </div>
                </div>
            </div>
        `;
    });
}

// 6. معالجة صندوق الشكاوى والاستفسارات وإرسالها
function sendComplaint(event) {
    event.preventDefault();
    const name = document.getElementById('comp-name').value.trim();
    const message = document.getElementById('comp-text').value.trim();

    if (!name || !message) {
        alert("الرجاء تعبئة كافة الحقول المطلوبة!");
        return;
    }

    alert(`شكراً لك يا ${name}. تم استلام رسالتك بنجاح وسيتواصل معك فريق دعم GoRide الإداري قريباً.`);
    document.getElementById('complaintForm').reset();
}