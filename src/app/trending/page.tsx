import Row from "./components/Row";
import Top10Row from "./components/Top10Row";

const dummy = (count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    title: `콘텐츠 ${i + 1}`,
    image: "/images/placeholder.jpg",
  }));

export default function TrendingPage() {
  const listA = dummy(16);
  const listB = dummy(16).map((x) => ({ ...x, id: x.id + 100 }));
  const listC = dummy(16).map((x) => ({ ...x, id: x.id + 200 }));

  return (
    <main style={{ paddingTop: 90, paddingBottom: 80, maxWidth: 1600, margin: "0 auto", width: "100%" }}>
      <Row title="넷플릭스의 새로운 콘텐츠" items={listA} indicatorCount={7} />

      <Top10Row title="오늘 대한민국의 TOP 10 시리즈" items={listB} variant="series" />
      <Top10Row title="오늘 대한민국의 TOP 10 영화" items={listC} variant="movie" />

      <Row title="다음 주 공개 콘텐츠" items={listA} indicatorCount={4} />
      <Row title="이번 주 공개 콘텐츠" items={listB} indicatorCount={3} />
      <Row title="기다림이 아깝지 않은 콘텐츠" items={listC} indicatorCount={7} />
    </main>
  );
}
