// ai-search.js - Varsity Vision Dynamic AI Search Component
(function() {
    // 📌 ১. বাংলা সংখ্যায় রূপান্তর ফাংশন
    function convertToBanglaNum(inputStr) {
        const englishNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const banglaNum = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        let output = String(inputStr);
        for (let i = 0; i < 10; i++) {
            output = output.replaceAll(englishNum[i], banglaNum[i]);
        }
        return output;
    }

    // 📌 ২. বর্তমানে বাংলাদেশ সময় (BST) সুন্দর বাংলা টেক্সটে পাওয়ার ফাংশন
    function getCurrentBanglaTime() {
        const now = new Date();
        // UTC+6 (Bangladesh Standard Time)
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const bdTime = new Date(utc + (3600000 * 6));
        
        let h = bdTime.getHours();
        let m = bdTime.getMinutes();
        
        let period = "সকাল";
        if (h >= 12 && h < 15) {
            period = "দুপুর";
        } else if (h >= 15 && h < 18) {
            period = "বিকাল";
        } else if (h >= 18 || h < 4) {
            period = "রাত";
        } else if (h >= 4 && h < 6) {
            period = "ভোর";
        }

        let displayHour = h % 12;
        if (displayHour === 0) displayHour = 12;

        let formattedH = String(displayHour).padStart(2, '0');
        let formattedM = String(m).padStart(2, '0');

        return `${period} ${convertToBanglaNum(formattedH)}:${convertToBanglaNum(formattedM)}`;
    }

    // 📌 ৩. সার্চ বার ও রেজাল্ট কার্ডের CSS স্টাইল যুক্ত করা
    const style = document.createElement('style');
    style.innerHTML = `
        .ai-search-wrapper {
            max-width: 850px;
            margin: 20px auto 15px auto;
            padding: 0 20px;
            font-family: 'Noto Serif Bengali', serif;
        }

        .ai-search-box {
            display: flex;
            align-items: center;
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-radius: 50px;
            padding: 6px 10px 6px 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }

        .ai-search-box:focus-within {
            border-color: #38bdf8;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
        }

        .search-icon {
            color: #38bdf8;
            font-size: 1.1rem;
            margin-right: 12px;
        }

        .ai-search-box input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #ffffff;
            font-size: 0.95rem;
            font-family: 'Noto Serif Bengali', serif;
        }

        .ai-search-box input::placeholder {
            color: #94a3b8;
        }

        .ai-search-box button {
            background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
            color: #ffffff;
            border: none;
            padding: 8px 20px;
            border-radius: 50px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: 'Noto Serif Bengali', serif;
            transition: all 0.3s ease;
        }

        .ai-search-box button:hover {
            transform: scale(1.03);
            box-shadow: 0 2px 12px rgba(6, 182, 212, 0.4);
        }

        .ai-response-card {
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(56, 189, 248, 0.3);
            border-radius: 16px;
            margin-top: 12px;
            padding: 16px 20px;
            color: #f8fafc;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            display: none;
            animation: fadeIn 0.3s ease-in-out;
        }

        .response-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 8px;
            margin-bottom: 10px;
            color: #38bdf8;
            font-weight: 700;
            font-size: 0.9rem;
        }

        .response-time {
            font-size: 0.8rem;
            color: #94a3b8;
            font-weight: normal;
            margin-left: 10px;
        }

        .close-btn {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 1.3rem;
            cursor: pointer;
        }

        .response-body {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #cbd5e1;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 📌 ৪. HTML এলিমেন্ট ডাইনামিকালি পেজে ইনজেক্ট করা
    document.addEventListener('DOMContentLoaded', function() {
        const wrapper = document.createElement('div');
        wrapper.className = 'ai-search-wrapper';
        wrapper.innerHTML = `
            <div class="ai-search-box">
                <i class="fa-solid fa-wand-magic-sparkles search-icon"></i>
                <input type="text" id="home-ai-input" placeholder="যেকোনো বিষয় সার্চ করুন বা এআই-কে জিজ্ঞাসা করুন..." autocomplete="off">
                <button id="home-ai-btn" type="button">
                    <span>সার্চ</span>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
            
            <div id="ai-response-box" class="ai-response-card">
                <div class="response-header">
                    <div>
                        <span><i class="fa-solid fa-robot"></i> Varsity Vision AI</span>
                        <span id="response-timestamp" class="response-time"></span>
                    </div>
                    <button id="close-ai-response" class="close-btn">&times;</button>
                </div>
                <div id="ai-response-content" class="response-body"></div>
            </div>
        `;

        // নেভিগেশন বারের ঠিক নিচে বসানো (যদি .sticky-header-container বা nav থাকে)
        const headerContainer = document.querySelector('.sticky-header-container') || document.querySelector('nav') || document.body.firstChild;
        if (headerContainer && headerContainer.nextSibling) {
            headerContainer.parentNode.insertBefore(wrapper, headerContainer.nextSibling);
        } else {
            document.body.insertBefore(wrapper, document.body.firstChild);
        }

        // 📌 ৫. ইভেন্ট লিসেনার ও সার্চ লজিক
        const aiInput = document.getElementById('home-ai-input');
        const aiBtn = document.getElementById('home-ai-btn');
        const responseBox = document.getElementById('ai-response-box');
        const responseContent = document.getElementById('ai-response-content');
        const timestampSpan = document.getElementById('response-timestamp');
        const closeBtn = document.getElementById('close-ai-response');

        async function handleAiSearch() {
            const query = aiInput.value.trim();
            if (!query) return;

            responseBox.style.display = 'block';
            timestampSpan.innerText = `(${getCurrentBanglaTime()})`;
            responseContent.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> এআই তথ্য নিয়ে আসছে... অনুগ্রহ করে অপেক্ষা করুন।';

            try {
                // এখানে আপনার এপিআই অ্যান্ডপয়েন্ট বা সার্চ ব্যাকএন্ড কল করতে পারেন।
                // ডেমো রেসপন্স:
                setTimeout(() => {
                    responseContent.innerHTML = `
                        <strong>আপনার সার্চ:</strong> "${query}"<br><br>
                        এটি একটি ডেমো এআই সার্চ ইন্টারফেস। ভবিষ্যতে আপনার ব্যাকএন্ড এপিআই কানেক্ট করা হলে এটি বিভিন্ন সার্চ ইঞ্জিন ও এআই মডেল থেকে লাইভ তথ্য এনে এখানে প্রসেস করে দেখাবে।
                    `;
                }, 1000);
            } catch (error) {
                responseContent.innerHTML = 'দুঃখিত, তথ্য প্রসেস করতে কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।';
            }
        }

        aiBtn.addEventListener('click', handleAiSearch);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleAiSearch();
        });

        closeBtn.addEventListener('click', function() {
            responseBox.style.display = 'none';
        });
    });
})();