$(function(){

    // 커스텀 셀렉트 CUSTOM SELECT
    var selectBoxes = document.querySelectorAll('.custom-select');

    selectBoxes.forEach(selectBox => {
        var selectedValue = selectBox.querySelector('.selected-value');
        var options = selectBox.querySelectorAll('.custom-select-options li');

        // 2. 클릭 시 해당 셀렉트 박스만 토글
        selectBox.addEventListener('click', (e) => {
            // 다른 열려있는 셀렉트 박스들을 닫음
            closeAllSelects(selectBox);
            selectBox.classList.toggle('active');
        });

        // 3. 옵션 선택 이벤트
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // 클릭 이벤트가 부모(selectBox)로 퍼지는 것 방지
                selectedValue.textContent = option.textContent; // 텍스트 변경
                selectedValue.dataset.value = option.dataset.value
                selectBox.classList.remove('active'); // 선택 후 닫기

                // 선택된 데이터 처리 (예: 콘솔 출력)
                console.log(`선택된 값: ${option.dataset.value}`);
            });
        });
    });

    // 4. 외부 클릭 시 또는 다른 셀렉트 클릭 시 닫기 함수
    function closeAllSelects(currentSelect) {
        selectBoxes.forEach(box => {
            if (box !== currentSelect) {
                box.classList.remove('active');
            }
        });
    }



    // 데이터컬럼 정보 펼치기
    var dataColBtn = document.querySelector('.dataCol-btn');
    var columnBox = document.querySelector('.data-column-box');
    var btnIcon = document.querySelector('.dataCol-btn > .svg-icon');

    if (dataColBtn && columnBox && btnIcon) {
        dataColBtn.addEventListener('click', () => {
            var isOpen = columnBox.classList.contains('is-open');

            if (isOpen) {
                // 닫기
                columnBox.style.height = columnBox.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    columnBox.style.height = '0px';
                    columnBox.style.opacity = '0';
                });
                columnBox.classList.remove('is-open');

                btnIcon.classList.remove('up');
                btnIcon.classList.add('down');
            } else {
                // 열기
                columnBox.classList.add('is-open');
                columnBox.style.height = columnBox.scrollHeight + 'px';
                columnBox.style.opacity = '1';

                btnIcon.classList.remove('down');
                btnIcon.classList.add('up');

                // 애니메이션 끝나면 height 제거
                columnBox.addEventListener(
                    'transitionend',
                    () => {
                        if (columnBox.classList.contains('is-open')) {
                            columnBox.style.height = 'auto';
                        }
                    },
                    { once: true }
                );
            }
        });
    }



    // 페이지 상단 이동
    var pageTopBtn = document.querySelector('.page-top-button');
    var MOBILE_MAX_WIDTH = 767;

    if (pageTopBtn) {
        function handleScroll() {
            var winWidth = window.innerWidth;

            // 모바일에서는 항상 숨김
            if (winWidth <= MOBILE_MAX_WIDTH) {
                pageTopBtn.classList.remove('active');
                return;
            }

            var scrollTop = window.scrollY;
            var docHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (docHeight <= 0) return;

            var scrollRatio = scrollTop / docHeight;
            pageTopBtn.classList.toggle('active', scrollRatio >= 0.2);
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        pageTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 최초 로딩 시 1회 체크
        handleScroll();
    }


    // ai검색 왼쪽 메뉴 닫기
    $(function () {
        var aiBREAKPOINT = 1439;
        var $aiMenu = $('.utility-menu');
        var $aiMenuBtn = $('.menu-btn');

        function handleResize() {
            var winWidth = $(window).width();

            // 1023px 이하에서는 무조건 닫힘(active)
            if (winWidth <= aiBREAKPOINT) {
                $aiMenu.addClass('active');
            } else {
                $aiMenu.removeClass('active');
            }
        }

        // 메뉴 버튼 클릭 (항상 토글 가능)
        $aiMenuBtn.on('click', function () {
            $aiMenu.toggleClass('active');
        });

        // 리사이즈 감지
        $(window).on('resize', handleResize);

        // 최초 로딩 시에도 적용
        handleResize();
    });


    // 추천 데이터 메뉴 닫기
    $(function () {
        var recoBREAKPOINT = 1023;
        var $recoMenu = $('.recommend-wrap');
        var $recoMenuBtn = $('.folder-btn');

        function handleResize() {
            var winWidth = $(window).width();

            // 1023px 이하에서는 무조건 닫힘(active)
            if (winWidth <= recoBREAKPOINT) {
                $recoMenu.removeClass('active');
            } else {
                $recoMenu.addClass('active');
            }
        }

        // 메뉴 버튼 클릭 (항상 토글 가능)
        $recoMenuBtn.on('click', function () {
            $recoMenu.toggleClass('active');
        });

        // 리사이즈 감지
        $(window).on('resize', handleResize);

        // 최초 로딩 시에도 적용
        handleResize();
    });



    // 마이페이지 api 공지사항 캐러셀
    new Swiper(".myboard-notice .swiper", {
        slidesPerView: 3,
        spaceBetween: 16,
        // speed: 400,
        navigation: {
            nextEl: ".myboard-notice .swiper-button-next",
            prevEl: ".myboard-notice .swiper-button-prev",
        },
        pagination: {
            el: ".myboard-notice .swiper-pagination",
            type: "fraction",
        },
        breakpoints: {
            300: {
                slidesPerView: 1
            },
            767: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            },
        },
    });


// 데이터 목록 검색조건 영역 활성화
    const chipsWrap = document.querySelector('.example-chips');
    const moreBtn = document.querySelector('.btn-ex-more');

    if (chipsWrap && moreBtn) {
        const firstChip = chipsWrap.querySelector('.chip');

        // 접힌 상태 높이 설정 (padding / 줄바꿈 포함)
        const setCollapsedHeight = () => {
            if (!firstChip || window.innerWidth > 767) return;
            chipsWrap.style.maxHeight = firstChip.offsetHeight + 'px';
        };

        // 초기 실행
        setCollapsedHeight();

        // 리사이즈 대응
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 767) {
                if (chipsWrap.classList.contains('active')) {
                    chipsWrap.style.maxHeight = chipsWrap.scrollHeight + 'px';
                } else {
                    setCollapsedHeight();
                }
            } else {
                chipsWrap.style.maxHeight = '';
            }
        });

        // 버튼 클릭
        moreBtn.addEventListener('click', () => {
            const isOpen = chipsWrap.classList.toggle('active');

            chipsWrap.style.maxHeight = isOpen
                ? chipsWrap.scrollHeight + 'px'
                : firstChip.offsetHeight + 'px';

            // 버튼 텍스트 & 아이콘
            moreBtn.querySelector('.ico-angle')
                .classList.toggle('up', isOpen);
            moreBtn.querySelector('.ico-angle')
                .classList.toggle('down', !isOpen);

            moreBtn.firstChild.textContent = isOpen ? '예시 접기' : '예시 더보기';
            moreBtn.setAttribute('aria-expanded', isOpen);
        });
    }




    // 데이터 목록 검색조건 내 검색분류 탭
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.sch-tbl-tab .btn-tab');
        if (!btn) return;

        const tabItem = btn.closest('[role="tab"]');
        const tabList = tabItem.closest('.sch-tbl-tab');
        const targetPanelId = tabItem.getAttribute('aria-controls');

        if (!tabList || !targetPanelId) return;

        // 모든 탭 비활성화
        tabList.querySelectorAll('[role="tab"]').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');

            const sr = tab.querySelector('.sr-only.created');
            if (sr) sr.remove();
        });

        // 클릭한 탭 활성화
        tabItem.classList.add('active');
        tabItem.setAttribute('aria-selected', 'true');

        // 스크린리더용 텍스트 추가
        btn.insertAdjacentHTML(
            'beforeend',
            '<i class="sr-only created"> 선택됨</i>'
        );

        // 콘텐츠 패널 전환
        const wrap = document.querySelector('.sch-tab-wrap');
        wrap.querySelectorAll('.tab-conts').forEach(panel => {
            panel.classList.toggle(
                'active',
                panel.id === targetPanelId
            );
        });
    });



    // 국민참여지도 왼쪽 메뉴 닫힘
    const map1Depth = document.querySelector('.map-1depth');
    const map2Depth = document.querySelector('.map-2depth');

    const btn1DepthClose = document.querySelector('.btn-1depth');
    const btn1DepthOpen  = document.querySelector('.btn-1depth-open');

    const btn2DepthOpen  = document.querySelector('.btn-topic-add');
    const btn2DepthClose = document.querySelector('.btn-topic-closed');


    // 1Depth 제어
    if (map1Depth) {

        // 1Depth 닫기 (2Depth도 함께 닫힘)
        btn1DepthClose?.addEventListener('click', () => {
            map1Depth.classList.add('closed');
            map2Depth?.classList.remove('active');
        });

        // 1Depth 열기
        btn1DepthOpen?.addEventListener('click', () => {
            map1Depth.classList.remove('closed');
        });
    }

    // 2Depth 제어
    if (map2Depth) {

        // 2Depth 열기
        btn2DepthOpen?.addEventListener('click', () => {
            map2Depth.classList.add('active');
        });

        // 2Depth 닫기
        // btn2DepthClose?.addEventListener('click', () => {
        //     map2Depth.classList.remove('active');
        // });
        // querySelectorAll로 모든 닫기 버튼 처리
        document.querySelectorAll('.btn-topic-closed').forEach(btn => {
            btn.addEventListener('click', () => {
                map2Depth.classList.remove('active');
            });
        });
    }


    // ** 국가중점데이터 아코디언 닫기 버튼
    document.addEventListener('click', function (e) {
        const foldBtn = e.target.closest('.accordion-fold-btn > button');
        if (!foldBtn) return;

        const item = foldBtn.closest('.accordion-item');
        if (!item) return;

        // 1. accordion 닫기
        item.classList.remove('active');
        // 2. 같은 item 안의 아코디언 버튼 상태 초기화
        item.querySelectorAll('.btn-accordion').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    // ** 국가중점데이터 아코디언 모바일에서 active 비활성화
    const firstAccordion = document.querySelector('.nation-data-wrap .accordion-item:first-child');
    function handleResponsiveAccordion() {
        if (!firstAccordion) return;

        const isMobile = window.innerWidth <= 768;
        const btns = firstAccordion.querySelectorAll('.nation-data-wrap .btn-accordion');

        if (isMobile) {
            // 모바일 → 닫힘 상태
            firstAccordion.classList.remove('active');
            btns.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        } else {
            // 웹 → 기본 열림 상태
            firstAccordion.classList.add('active');
            btns.forEach(btn => {
                btn.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            });
        }
    }
    // 최초 실행
    handleResponsiveAccordion();
    // 화면 크기 변경 대응 (가로모드 회전 포함)
    window.addEventListener('resize', handleResponsiveAccordion);



    // ** 전체메뉴 컨트롤
    const menuLayer = document.getElementById('totalMenuLayer');
    const openBtn = document.querySelector('.all-menu-btn');
    const closeBtn = menuLayer?.querySelector('.total-menu-close-btn');
    const focusWrap = menuLayer?.querySelector('.total-menu-layer-wrap');

    let lastFocused = null;

    // 열기
    function openMenu() {
        lastFocused = document.activeElement;

        menuLayer.classList.add('active');
        menuLayer.setAttribute('aria-hidden', 'false');
        menuLayer.setAttribute('aria-modal', 'true');
        openBtn?.setAttribute('aria-expanded', 'true');

        document.body.classList.add('scroll-lock');

        // 레이어 내부로 포커스 이동
        setTimeout(() => focusWrap.focus(), 50);
    }

    // 닫기
    function closeMenu() {
        menuLayer.classList.remove('active');
        menuLayer.setAttribute('aria-hidden', 'true');
        menuLayer.setAttribute('aria-modal', 'false');
        openBtn?.setAttribute('aria-expanded', 'false');

        document.body.classList.remove('scroll-lock');

        // 원래 위치로 포커스 복귀
        lastFocused?.focus();
    }

    openBtn?.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);

    // ESC 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuLayer.classList.contains('active')) {
            closeMenu();
        }
    });


    /* 푸터 관련기관 */
    const footQuick = document.querySelector('.foot-quick');

    if(footQuick !== null) {
        const closeAll = () => {
            footQuick.querySelectorAll('.site-link-list.active').forEach(list => {
                list.classList.remove('active');
                list.previousElementSibling.setAttribute('aria-expanded', 'false');
            });
        };

        footQuick.addEventListener('click', (e) => {
            const btn = e.target.closest('.link');
            if (!btn) return;

            const list = btn.nextElementSibling;
            const isOpen = list.classList.contains('active');

            closeAll();

            if (!isOpen) {
                list.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });

        // 바깥 클릭
        document.addEventListener('click', e => {
            if (!e.target.closest('.foot-quick')) closeAll();
        });

        // 포커스 이동(Tab)
        document.addEventListener('focusin', e => {
            if (!e.target.closest('.foot-quick')) closeAll();
        });
    }


    /* 설문조사 스크롤시 버튼 플로팅 */
    window.addEventListener('scroll', () => {

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // 현재 스크롤 비율 (0 ~ 1)
        const scrollPercent = scrollTop / docHeight;

        const target = document.querySelector('.survey-btn-wrap');
        if (!target) return;

        // 20% ~ 80%
        if (scrollPercent >= 0.2 && scrollPercent <= 0.7) {
            target.classList.add('fixed');
        } else {
            target.classList.remove('fixed');
        }

    });
})