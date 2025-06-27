// HTMLドキュメントの読み込みが完了したら、中の処理を実行する
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ==================================
     * 天気予報ウィジェット機能
     * ==================================
     */
    const fetchWeather = async () => {
        const weatherWidget = document.getElementById('weather-info');
        // APIキー不要の天気情報サービス(wttr.in)から大阪の天気情報をJSON形式で取得
        const apiUrl = 'https://wttr.in/Osaka?format=j1';

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('天気情報の取得に失敗しました。');
            }
            const data = await response.json();

            // 必要な情報を抽出
            const currentCondition = data.current_condition[0];
            const todayWeather = data.weather[0];
            const description = currentCondition.weatherDesc[0].value;
            const tempC = currentCondition.temp_C;
            const maxTemp = todayWeather.maxtempC;
            const minTemp = todayWeather.mintempC;

            // 天気に応じたアイコンを決定
            let weatherIcon = 'fa-solid fa-cloud-sun'; // デフォルト
            if (description.includes('Sunny') || description.includes('Clear')) {
                weatherIcon = 'fa-solid fa-sun';
            } else if (description.includes('Rain') || description.includes('Shower')) {
                weatherIcon = 'fa-solid fa-cloud-showers-heavy';
            } else if (description.includes('Cloudy')) {
                weatherIcon = 'fa-solid fa-cloud';
            } else if (description.includes('Snow')) {
                weatherIcon = 'fa-solid fa-snowflake';
            }

            // HTMLを組み立ててウィジェットに表示
            weatherWidget.innerHTML = `
                <div class="weather-main">
                    <i class="${weatherIcon}"></i>
                    <span class="weather-temp">${tempC}°C</span>
                    <span class="weather-desc">${description}</span>
                </div>
                <div class="weather-sub">
                    <span>最高: ${maxTemp}°C</span> / <span>最低: ${minTemp}°C</span>
                </div>
            `;

        } catch (error) {
            console.error(error);
            weatherWidget.innerHTML = '<p>天気情報を取得できませんでした。</p>';
        }
    };

    // 天気予報を実行
    fetchWeather();


    /**
     * ==================================
     * スクロールでのフェードインアニメーション機能
     * ==================================
     */
    const cards = document.querySelectorAll('.card');

    // Intersection Observerのオプション設定
    const options = {
        root: null, // ビューポートを基準にする
        rootMargin: '0px',
        threshold: 0.2 // 要素が20%見えたら実行
    };

    // Intersection Observerのインスタンスを作成
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 要素が画面内に入ったら
            if (entry.isIntersecting) {
                // 'visible'クラスを追加してアニメーションを発火
                entry.target.classList.add('visible');
                // 一度表示したら監視を解除してパフォーマンスを向上
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 各カード要素を監視対象に追加
    cards.forEach(card => {
        observer.observe(card);
    });

});