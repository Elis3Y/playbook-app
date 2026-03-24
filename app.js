/**
 * app.js
 * Controls dynamic card animations, tab switching, and scroll-spy interactions
 */

document.addEventListener("DOMContentLoaded", () => {
    // Reveal animation for homepage cards
    const cards = document.querySelectorAll('.playbook-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) ${index * 0.15}s`;
        void card.offsetWidth; // reflow
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = '';
            setTimeout(() => { card.style.transition = 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'; }, 600 + index * 150);
        }, 50);
    });

    // --- Tab Switching Logic ---
    const primaryTabs = document.querySelectorAll('.primary-tabs .tab-btn');
    const secondaryTabsContainer = document.querySelector('.secondary-tabs');
    const secondaryTabs = document.querySelectorAll('.secondary-tabs .sub-tab-btn');
    
    // Tab Panes container wrappers
    const documentPanes = document.querySelectorAll('.tab-pane');
    const overviewWrapper = document.getElementById('overview-wrapper');
    const processContent = document.getElementById('process-content');

    // These primary tabs show the Overview/Process secondary navigation
    const tabsWithSubnav = ['style', 'ways', 'flow', 'code', 'guide'];

    primaryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            primaryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabId = tab.getAttribute('data-tab');

            // 1. Show the specific content for the clicked tab
            documentPanes.forEach(pane => {
                pane.style.display = 'none';
            });
            const activePane = document.getElementById(`content-${tabId}`);
            if (activePane) {
                activePane.style.display = 'flex'; // 'flex' because of split-layout
            }

            // 2. Show/Hide Secondary Tabs if applicable
            if (secondaryTabsContainer) {
                if (tabsWithSubnav.includes(tabId)) {
                    secondaryTabsContainer.style.display = 'flex';
                } else {
                    secondaryTabsContainer.style.display = 'none';
                }
            }

            // 3. Reset secondary tab state to 'Overview' whenever primary tab changes
            if (secondaryTabs.length > 0) {
                secondaryTabs.forEach(t => t.classList.remove('active'));
                const overviewBtn = document.querySelector('.sub-tab-btn[data-subtab="overview"]');
                if (overviewBtn) overviewBtn.classList.add('active');
                
                if (overviewWrapper && processContent) {
                    overviewWrapper.style.display = 'block';
                    processContent.style.display = 'none';
                }
            }
            
            // Re-bind Intersection Observer because new sections are now visible
            rebindObserver();
        });
    });

    secondaryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            secondaryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const subtabId = tab.getAttribute('data-subtab');
            
            if (overviewWrapper && processContent) {
                if (subtabId === 'overview') {
                    overviewWrapper.style.display = 'block';
                    processContent.style.display = 'none';
                    rebindObserver(); // Rebind since sections are visible again
                } else if (subtabId === 'process') {
                    overviewWrapper.style.display = 'none';
                    processContent.style.display = 'block';
                }
            }
        });
    });

    // --- ScrollSpy & Smooth Scrolling ---
    function rebindObserver() {
        // Disconnect old observer first if exists
        if (window.activeObserver) {
            window.activeObserver.disconnect();
        }

        // Only select links and sections that are CURRENTLY visible
        const visibleSplitLayout = Array.from(documentPanes).find(pane => pane.style.display !== 'none');
        if (!visibleSplitLayout) return;

        const scrollLinks = visibleSplitLayout.querySelectorAll('.scroll-link');
        const contentSections = visibleSplitLayout.querySelectorAll('.content-section');

        if (contentSections.length > 0 && scrollLinks.length > 0) {
            // Smooth scroll click binding
            scrollLinks.forEach(link => {
                // remove old listeners by cloning
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Remove active from all
                    scrollLinks.forEach(l => l.classList.remove('active'));
                    newLink.classList.add('active');

                    const targetId = newLink.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const headerOffset = 140; 
                        const elementPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Intersection Observer
            const observerOptions = {
                root: null,
                rootMargin: '-150px 0px -60% 0px',
                threshold: 0
            };

            window.activeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        // Find current visible pane links again
                        const currentPaneLinks = visibleSplitLayout.querySelectorAll('.scroll-link');
                        currentPaneLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = visibleSplitLayout.querySelector(`.scroll-link[href="#${id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            }, observerOptions);

            contentSections.forEach(section => {
                window.activeObserver.observe(section);
            });
        }
    }

    // Bind initially
    rebindObserver();
});
