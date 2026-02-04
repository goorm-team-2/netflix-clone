export default function Footer() {
    return (
    <footer>
        <div className="footer-container">
            <div className="social-links">
                <a href="#"><img src="/facebook.svg" alt="facebook"/></a>
                <a href="#"><img src="/instagram.svg" alt="instagram"/></a>
                <a href="#"><img src="/twitter.svg" alt="twitter"/></a>
                <a href="#"><img src="/youtube.svg" alt="youtube"/></a>
            </div>

            <ul className="footer-links">
                <li><a href="#">화면 해설</a></li>
                <li><a href="#">고객 센터</a></li>
                <li><a href="#">기프트카드</a></li>
                <li><a href="#">미디어 센터</a></li>
                <li><a href="#">투자 정보(IR)</a></li>
                <li><a href="#">입사 정보</a></li>
                <li><a href="#">이용 약관</a></li>
                <li><a href="#">개인정보</a></li>
                <li><a href="#">법적 고지</a></li>
                <li><a href="#">쿠키 설정</a></li>
                <li><a href="#">회사 정보</a></li>
                <li><a href="#">문의하기</a></li>
            </ul>

            <div className="footer-info">
                <p>넷플릭스서비스코리아 유한회사 통신판매업신고번호: 제2018-서울종로-0426호</p>
                <p>전화번호: 00-308-321-0161 (수신자 부담)</p>
                <p>대표: 레지널드 숀 톰프슨</p>
                <p>이메일 주소: korea@netflix.com</p>
                <p>주소: 대한민국 서울특별시 종로구 우정국로 26, 센트로폴리스 A동 20층 우편번호 03161</p>
                <p>사업자등록번호: 165-87-00119</p>
                <p>클라우드 호스팅: Amazon Web Services Inc.</p>
                <p>공정거래위원회 웹사이트</p>
            </div>
        </div>
    </footer>);
}