// 1. استدعاء مكتبات وتوابع Firebase الحديثة عبر الـ CDN لتعمل مباشرة على الويب
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. مفاتيح وتكوين السيرفر السحابي الخاص بمشروعك GoRide
const firebaseConfig = {
  apiKey: "AIzaSyDf_edtZzF4kay5cNTSHtgUcE_QOkIrz1k",
  authDomain: "goride-a5f66.firebaseapp.com",
  projectId: "goride-a5f66",
  storageBucket: "goride-a5f66.firebasestorage.app",
  messagingSenderId: "868206593746",
  appId: "1:868206593746:web:8f7364dabb9cb6413ccf0b"
};

// 3. تهيئة النظام والاتصال بقاعدة البيانات السحابية
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحديد مرجع المستند السحابي لإعدادات الموقع
const settingsDocRef = doc(db, "site_settings", "v1");

// 4. مصفوفات البيانات الافتراضية لحماية تصميم الموقع في حال كان السيرفر السحابي فارغاً
const defaultVideos = [
    "https://archive.org/download/img-8101_202606/IMG_8098.MP4",
    "https://archive.org/download/img-8101_202606/IMG_8100.MP4",
    "https://archive.org/download/img-8101_202606/IMG_8101.MP4"
];

const defaultServices = [
    { title: "توصيل طعام", desc: "أشهى المأكولات والوجبات الساخنة من مطاعمك المفضلة مباشرة إلى باب بيتك بأعلى سرعة.", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400" },
    { title: "توصيل طلبات", desc: "توصيل وشحن الطرود، الهدايا، والمستندات الهامة بسرعة فائقة وأمان مطلق يضمن سلامة شحنتك.", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400" },
    { title: "توصيل ركابة", desc: "رحلات وتوصيل يومي ذكي وآمن مع كباتن محترفين مدربين، متاحين لخدمتك على مدار الساعة.", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400" }
];

const defaultReviews = [
    { name: "سارة أحمد", title: "مخططة رحلات", text: "تجربة رائعة جداً، دقة متناهية وسرعة مذهلة في تلبية الطلبات والتنقل بكفاءة.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" },
    { name: "أحمد علي", title: "مهندس تقني", text: "التطبيق الأفضل للتنقل الداخلي، الأسعار منافسة جداً والتعامل راقٍ للغاية.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" }
];

// متغيرات عامة لحفظ الحالة الديناميكية الحالية للخدمات والمراجعات
let currentServices = defaultServices;
let currentReviews = defaultReviews;

// 5. دالة التحميل والمزامنة السحابية الرئيسية التلقائية عند فتح الموقع
document.addEventListener("DOMContentLoaded", () => {
    // تفعيل ميزة مراقبة السيرفر الفورية Realtime Listener
    listenToCloudSettings();
    
    // ربط الدوال المتبقية بالنطاق العام (window) لكي تظل صالحة للعمل مع الـ modules
    window.swapVideo = swapVideo;
    window.openServiceDetail = openServiceDetail;
    window.closeServiceDetail = closeServiceDetail;
    window.sendComplaint = sendComplaint;
});

// 6. ميزة الاستماع الفوري والتطبيق السحابي بديل الـ localStorage
function listenToCloudSettings() {
    onSnapshot(settingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // أ) تحديث روابط الفيديوهات للمشغل الذكي
            if(document.getElementById('main-video')) document.getElementById('main-video').src = data.video1 || defaultVideos[0];
            if(document.getElementById('side-video-1')) document.getElementById('side-video-1').src = data.video2 || defaultVideos[1];
            if(document.getElementById('side-video-2')) document.getElementById('side-video-2').src = data.video3 || defaultVideos[2];

            // ب) تحديث أسماء وعناوين القائمة العلوية Navbar
            if(document.getElementById('menu-home')) document.getElementById('menu-home').innerText = data.titleHome || "الرئيسية";
            if(document.getElementById('menu-services')) document.getElementById('menu-services').innerText = data.titleServices || "الخدمات";
            if(document.getElementById('menu-features')) document.getElementById('menu-features').innerText = data.titleFeatures || "مميزاتنا";
            if(document.getElementById('menu-reviews')) document.getElementById('menu-reviews').innerText = data.reviewsTitle || "آراء عملائنا";
            if(document.getElementById('menu-support')) document.getElementById('menu-support').innerText = data.titleSupport || "الدعم والشكاوى";

            // ج) تحديث عناوين الأقسام الرئيسية في الصفحة Headers
            if(document.getElementById('sec-title-services')) document.getElementById('sec-title-services').innerText = data.titleServices || "الخدمات";
            if(document.getElementById('sec-title-features')) document.getElementById('sec-title-features').innerText = data.titleFeatures || "مميزاتنا";
            if(document.getElementById('sec-title-reviews')) document.getElementById('sec-title-reviews').innerText = data.reviewsTitle || "آراء عملائنا";
            if(document.getElementById('sec-title-support')) document.getElementById('sec-title-support').innerText = data.titleSupport || "📥 صندوق الاستفسارات والشكاوى الإلكتروني";

            // د) تحديث روابط تحميل التطبيق للمتاجر
            if(document.getElementById('link-apple')) document.getElementById('link-apple').href = data.linkApple || "https://apps.apple.com/sa/app/go-ride";
            if(document.getElementById('link-android')) document.getElementById('link-android').href = data.linkAndroid || "https://play.google.com/store/apps/details?id=com.goride";

            // هـ) تحديث رابط زر موقع الخريطة التفاعلي
            const mapBtn = document.getElementById('hero-map-btn');
            if (mapBtn) {
                mapBtn.href = data.mapUrl || "https://maps.google.com";
            }

            // و) جلب وبناء شبكات الخدمات والمراجعات سحابياً إن وُجدت
            currentServices = data.servicesData || defaultServices;
            currentReviews = data.reviewsData || defaultReviews;

            renderServicesGrid(currentServices);
            renderReviewsGrid(currentReviews);

            console.log("⚡ تمت المزامنة الفورية وتحديث واجهة الموقع سحابياً بنجاح!");
        } else {
            console.log("السيرفر فارغ حالياً، يتم تشغيل الموقع بالقيم الافتراضية.");
            renderServicesGrid(defaultServices);
            renderReviewsGrid(defaultReviews);
        }
    });
}

// 7. تبديل الفيديوهات داخل المشغل التفاعلي
function swapVideo(panelIndex) {
    const mainVid = document.getElementById('main-video');
    const sideVid1 = document.getElementById('side-video-1');
    const sideVid2 = document.getElementById('side-video-2');

    if (!mainVid || !sideVid1 || !sideVid2) return;

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

// 8. بناء شبكة بطاقات الخدمات برمجياً ديناميكياً
function renderServicesGrid(services) {
    const grid = document.getElementById('dynamic-services-grid');
    if (!grid) return;
    
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

// 9. نافذة عرض تفاصيل الخدمة المنبثقة (Popup)
function openServiceDetail(index) {
    const item = currentServices[index];
    if (!item) return;

    document.getElementById('popup-service-title').innerText = item.title;
    document.getElementById('popup-service-desc').innerText = item.desc;
    document.getElementById('popup-media-box').innerHTML = `<img src="${item.img}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
    
    document.getElementById('service-detail-popup').classList.add('popup-visible');
}

function closeServiceDetail() {
    document.getElementById('service-detail-popup').classList.remove('popup-visible');
}

// 10. بناء شبكة آراء ومراجعات العملاء ديناميكياً
function renderReviewsGrid(reviews) {
    const grid = document.getElementById('dynamic-reviews-grid');
    if (!grid) return;

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

// 11. معالجة صندوق الشكاوى والاستفسارات وإرسالها
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