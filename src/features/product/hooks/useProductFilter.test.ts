import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProductFilter } from "./useProductFilter";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

function setUrl(url: string) {
  window.history.replaceState(null, "", url);
}

function currentParam(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

beforeEach(() => {
  setUrl("/");
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useProductFilter", () => {
  it("URL의 q와 type을 읽어 filter를 만든다", () => {
    setUrl("/?q=시즌7&type=pass");

    const { result } = renderHook(() => useProductFilter());

    expect(result.current.filter).toEqual({ keyword: "시즌7", type: "pass" });
    expect(result.current.keywordInput).toBe("시즌7");
  });

  it("type이 유효하지 않은 값이면 all로 폴백한다", () => {
    setUrl("/?type=xxx");

    const { result } = renderHook(() => useProductFilter());

    expect(result.current.filter.type).toBe("all");
  });

  it("type 파라미터가 없으면 all이다", () => {
    const { result } = renderHook(() => useProductFilter());

    expect(result.current.filter).toEqual({ keyword: "", type: "all" });
  });

  it("검색어 입력은 즉시 반영되고 URL은 300ms 뒤에 갱신된다", () => {
    const { result } = renderHook(() => useProductFilter());

    act(() => result.current.changeKeyword("시즌"));

    expect(result.current.keywordInput).toBe("시즌");
    expect(currentParam("q")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(currentParam("q")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(currentParam("q")).toBe("시즌");
  });

  it("검색어를 빈 문자열로 지우면 URL에서 q가 제거된다", () => {
    setUrl("/?q=시즌7");

    const { result } = renderHook(() => useProductFilter());

    act(() => result.current.changeKeyword(""));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(currentParam("q")).toBeNull();
    expect(window.location.search).toBe("");
  });

  it("공백만 입력하면 URL에 q를 남기지 않는다", () => {
    const { result } = renderHook(() => useProductFilter());

    act(() => result.current.changeKeyword("   "));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(currentParam("q")).toBeNull();
  });

  it("setType은 디바운스 없이 즉시 URL을 갱신하고 all이면 파라미터를 제거한다", () => {
    const { result } = renderHook(() => useProductFilter());

    act(() => result.current.setType("pass"));
    expect(currentParam("type")).toBe("pass");

    act(() => result.current.setType("all"));
    expect(currentParam("type")).toBeNull();
    expect(window.location.search).toBe("");
  });

  it("한쪽 필터를 바꿔도 다른 쪽 파라미터는 유지된다", () => {
    setUrl("/?q=시즌7&type=pass");

    const { result } = renderHook(() => useProductFilter());

    act(() => result.current.setType("single"));
    expect(currentParam("q")).toBe("시즌7");
    expect(currentParam("type")).toBe("single");

    act(() => result.current.changeKeyword("시즌8"));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(currentParam("q")).toBe("시즌8");
    expect(currentParam("type")).toBe("single");
  });

  it("연속 입력 중에는 URL을 갱신하지 않고 마지막 값만 반영한다", () => {
    const replaceState = vi.spyOn(window.history, "replaceState");
    const { result } = renderHook(() => useProductFilter());

    act(() => result.current.changeKeyword("시"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => result.current.changeKeyword("시즌"));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    act(() => result.current.changeKeyword("시즌7"));

    expect(replaceState).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(currentParam("q")).toBe("시즌7");
  });

  it("디바운스 결과가 현재 URL과 같으면 URL을 다시 쓰지 않는다", () => {
    setUrl("/?q=시즌7");

    const { result } = renderHook(() => useProductFilter());
    const replaceState = vi.spyOn(window.history, "replaceState");

    act(() => result.current.changeKeyword("시즌7"));
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(replaceState).not.toHaveBeenCalled();
  });

  it("외부에서 URL이 바뀌면 입력창을 URL 값으로 동기화한다", () => {
    const { result, rerender } = renderHook(() => useProductFilter());

    act(() => result.current.changeKeyword("시즌7"));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.keywordInput).toBe("시즌7");

    setUrl("/?q=시즌8");
    act(() => rerender());

    expect(result.current.keywordInput).toBe("시즌8");
    expect(result.current.filter.keyword).toBe("시즌8");
  });

  it("자신이 만든 URL 변경으로는 입력창을 덮어쓰지 않는다", () => {
    const { result, rerender } = renderHook(() => useProductFilter());

    act(() => result.current.changeKeyword("  시즌7  "));
    act(() => {
      vi.advanceTimersByTime(300);
    });
    act(() => rerender());

    expect(currentParam("q")).toBe("시즌7");
    expect(result.current.keywordInput).toBe("  시즌7  ");
  });
});
