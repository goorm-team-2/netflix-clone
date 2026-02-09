// src/app/page.tsx
import Homefridge from "@/components/feature/Homefridge";
import Row from "./trending/components/Row";
import Top10Row from "./trending/components/Top10Row";


type Item = {
  id: number;
  title: string;
  image: string;
};

const dummy = (count: number, offset: number, label: string): Item[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: offset + i + 1,
    title: `${label} ${i + 1}`,
    image: "/images/placeholder.jpg",
  }));

export default function HomePage() {
  // 더미 데이터 TMDB 연결 전까지 그대로 재사용 예정
  const a = dummy(16, 0, "콘텐츠");
  const b = dummy(16, 1000, "콘텐츠");
  const c = dummy(16, 2000, "콘텐츠");
  const d = dummy(16, 3000, "콘텐츠");
  const e = dummy(16, 4000, "콘텐츠");

  // 내가 찜한 리스트는 인디케이터 없게 
  const picked5 = dummy(5, 9000, "찜한 콘텐츠");

  return (
    <main
      style={{
        background: "#141414",
        color: "white",
        paddingBottom: 80,
      }}
    >
      <Homefridge />

      <div style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}>
        <Row
          title="내가 찜한 리스트"
          items={picked5}
          indicatorCount={0}
          loop={false}
        />

        <Row title="다인 님이 시청 중인 콘텐츠" items={a} indicatorCount={3} />
        <Row title="꼭 챙겨 보세요! 회원님을 위한 콘텐츠" items={b} indicatorCount={7} />
        <Row title="코미디 영화" items={c} indicatorCount={7} />
        <Top10Row title="오늘 대한민국의 TOP 10 시리즈" items={d} variant="series" />
        <Row title="미국 영화" items={e} indicatorCount={7} />
        <Row
          title="울고 싶은 나는 고양이 가면을 쓴다(와) 비슷한 콘텐츠"
          items={a}
          indicatorCount={7}
        />
        <Row title="WWE: 라이브 & 공개 예정" items={b} indicatorCount={3} />
        <Top10Row title="오늘 대한민국의 TOP 10 영화" items={c} variant="movie" />
        <Row title="넷플릭스에 새로 올라온 콘텐츠" items={d} indicatorCount={13} />
        <Row title="로맨틱한 할리우드 영화" items={e} indicatorCount={7} />
        <Row title="로맨틱한 한국 코미디 시리즈" items={a} indicatorCount={7} />
        <Row title="로맨스는 역시 K-콘텐츠" items={b} indicatorCount={7} />
        <Row title="작품성을 인정받은 시리즈" items={c} indicatorCount={7} />
        <Row title="더 라스트 레터(와) 비슷한 콘텐츠" items={d} indicatorCount={7} />
        <Row title="영감을 받고 싶다면?" items={e} indicatorCount={7} />
        <Row title="연인과의 로맨틱한 밤을 위한 영화" items={a} indicatorCount={7} />
        <Row title="도서 원작 영화" items={b} indicatorCount={7} />
        <Row title="빛나는 그녀들의 이야기" items={c} indicatorCount={7} />
        <Row title="나는 솔로(와) 비슷한 콘텐츠" items={d} indicatorCount={7} />
        <Row title="라스트 송(와)과 비슷한 콘텐츠" items={e} indicatorCount={7} />
        <Row title="시애틀의 잠 못 이루는 밤(와)과 비슷한 콘텐츠" items={a} indicatorCount={7} />
        <Row title="언제나 사랑받는 로맨스 콘텐츠" items={b} indicatorCount={7} />
        <Row title="느낌 좋은 미국 영화" items={c} indicatorCount={7} />
        <Row title="아동 도서 원작 미국 영화" items={d} indicatorCount={6} />
        <Row title="로맨틱한 해외 영화" items={e} indicatorCount={7} />
        <Row title="로맨틱한 시대극 시리즈" items={a} indicatorCount={7} />
        <Row title="1990년대 영화" items={b} indicatorCount={7} />
        <Row title="우정에 관한 한국 TV 코미디" items={c} indicatorCount={4} />
        <Row title="여자들끼리 즐기는 콘텐츠" items={d} indicatorCount={7} />
        <Row title="케이트(와) 비슷한 콘텐츠" items={e} indicatorCount={7} />
        <Row title="잠든 여인(와) 비슷한 콘텐츠" items={a} indicatorCount={7} />
        <Row title="오퍼레이션 피날레(와)과 비슷한 콘텐츠" items={b} indicatorCount={7} />
        <Row title="일본 가족 영화" items={c} indicatorCount={7} />
        <Row title="그림 형제: 마르바덴 숲의 전설(와) 비슷한 콘텐츠" items={d} indicatorCount={7} />
        <Row title="어른이 되는 중" items={e} indicatorCount={7} />
        <Row title="골든글로브 수상 영화" items={a} indicatorCount={7} />
        <Row title="느긋한 휴식을 위해" items={b} indicatorCount={7} />
        <Row title="도서 원작 느낌 좋은 미국 영화" items={c} indicatorCount={7} />
      </div>
    </main>
  );
}
