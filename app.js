/**
 * app.js
 * Controls dynamic card animations, tab switching, and interactive diagrams
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- Reveal animation for homepage cards ---
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

    // --- Tab Switching Logic (Universal) ---
    const primaryTabs = document.querySelectorAll('.primary-tabs .tab-btn');
    const secondaryTabsContainer = document.querySelector('.secondary-tabs');
    const secondaryTabs = document.querySelectorAll('.secondary-tabs .sub-tab-btn');
    
    // Content containers
    const tabPanes = document.querySelectorAll('.tab-pane'); // For Found. Playbook
    const tabContents = document.querySelectorAll('.tab-content'); // For App/Dev Playbook
    const overviewWrapper = document.getElementById('overview-wrapper');
    const processContent = document.getElementById('process-content');

    const tabsWithSubnav = ['style', 'ways', 'flow', 'code', 'guide'];

    primaryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            primaryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabId = tab.getAttribute('data-tab');

            // 1. Handle Found. Playbook panes
            if (tabPanes.length > 0) {
                tabPanes.forEach(pane => pane.style.display = 'none');
                const activePane = document.getElementById(`content-${tabId}`);
                if (activePane) activePane.style.display = 'flex';
            }

            // 2. Handle App/Dev Playbook contents (Process 1, 2, 3)
            if (tabContents.length > 0) {
                tabContents.forEach(c => {
                    c.style.display = 'none';
                    c.classList.remove('active');
                });
                const activeContent = document.getElementById(`${tabId}-content`);
                if (activeContent) {
                    activeContent.style.display = 'block';
                    activeContent.classList.add('active');
                }
            }

            // 3. Secondary Nav Logic
            if (secondaryTabsContainer) {
                secondaryTabsContainer.style.display = tabsWithSubnav.includes(tabId) ? 'flex' : 'none';
            }

            // Reset secondary tabs
            if (secondaryTabs.length > 0) {
                secondaryTabs.forEach(t => t.classList.remove('active'));
                const overviewBtn = document.querySelector('.sub-tab-btn[data-subtab="overview"]');
                if (overviewBtn) overviewBtn.classList.add('active');
                
                if (overviewWrapper && processContent) {
                    overviewWrapper.style.display = 'block';
                    processContent.style.display = 'none';
                }
            }
            
            rebindObserver();
        });
    });

    if (secondaryTabs.length > 0) {
        secondaryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                secondaryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const subtabId = tab.getAttribute('data-subtab');
                if (overviewWrapper && processContent) {
                    if (subtabId === 'overview') {
                        overviewWrapper.style.display = 'block';
                        processContent.style.display = 'none';
                        rebindObserver();
                    } else {
                        overviewWrapper.style.display = 'none';
                        processContent.style.display = 'block';
                    }
                }
            });
        });
    }

    // --- Modal Logic & Data ---
    const modal = document.getElementById('info-modal');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const processData = {
        // Steps
        "step1": {
            category: "Major Step 01",
            title: "Prepare the Ground",
            description: "Establishing the fundamental infrastructure and strategic alignment required for a high-performance product delivery lifecycle.",
            sections: [
                { title: "Checklist", items: ["Establish landing zone", "Verify cloud credentials", "Baseline design review", "Infrastructure as Code setup"] },
                { title: "Healthy Habits", items: ["Daily standups", "Transparent documentation", "Asynchronous updates", "Post-sprint audits"] }
            ]
        },
        "step2": {
            category: "Major Step 02",
            title: "Align the Group and Start",
            description: "Onboarding stakeholders and technical teams to ensure a shared mental model of goals, responsibilities, and success metrics.",
            sections: [
                { title: "Checklist", items: ["Kickoff meeting held", "Roles defined (RACI)", "Access granted", "Budget finalized"] },
                { title: "Healthy Habits", items: ["Active listening", "Prompt feedback loops", "Inclusive decision making"] }
            ]
        },
        "step3": {
            category: "Major Step 03",
            title: "Need for Change and Areas to Improve",
            description: "Auditing the current ecosystem to pinpoint inefficiencies, risks, and strategic opportunities for modernization.",
            sections: [
                { title: "Checklist", items: ["Gap analysis complete", "Risk registry updated", "Technical debt audit"] },
                { title: "Healthy Habits", items: ["Continuous improvement mindset", "Data-driven decisions", "Honest retrospectives"] }
            ]
        },
        "step4": {
            category: "Major Step 04",
            title: "Set a Clear Direction and Intent",
            description: "Defining the product vision and high-level architectural intent to guide the development sprints.",
            sections: [
                { title: "Checklist", items: ["Roadmap draft approved", "Sprint 0 planned", "KPIs defined"] },
                { title: "Healthy Habits", items: ["Commitment to core vision", "Scalability focus", "User-centric planning"] }
            ]
        },
        "step5": {
            category: "Major Step 05",
            title: "Show the Path Forward",
            description: "Finalizing the execution strategy and establishing the sequence of tactical steps for immediate implementation.",
            sections: [
                { title: "Checklist", items: ["Next steps sequence created", "Resource allocation finalized", "Go/No-go criteria set"] },
                { title: "Healthy Habits", items: ["Clear ownership", "Milestone tracking", "Transparent reporting"] }
            ]
        },
        // Substeps - Step 1
        "sub1_1": {
            category: "Substep 1.1",
            title: "Agree on a simple starting approach",
            description: "Define the minimal viable path to begin work without unnecessary complexity or over-engineering.",
            sections: [
                { title: "Process Steps", items: ["Select framework", "Define MVP scope", "Agree on branching strategy"] },
                { title: "Roles + SME's", items: ["Technical Lead", "Architect"] },
                { title: "Tools", items: ["Confluence", "Jira"] }
            ]
        },
        "sub1_2": {
          category: "Substep 1.2",
          title: "Decide a basic way of collaborating",
          description: "Establish the communication channels and cadence for efficient team interaction.",
          sections: [
              { title: "Process Steps", items: ["Select comms platform", "Define meeting schedule", "Set core hours"] },
              { title: "Roles + SME's", items: ["Scrum Master", "Team Leads"] },
              { title: "Tools", items: ["Slack", "Teams", "Calendar"] }
          ]
        },
        "sub1_3": {
          category: "Substep 1.3",
          title: "Make sure essential tools are available",
          description: "Technical provisioning for all team members involved in the initial phase.",
          sections: [
              { title: "Process Steps", items: ["License audit", "Software distribution", "Hardware check"] },
              { title: "Roles + SME's", items: ["IT Operations", "Security Lead"] },
              { title: "Tools", items: ["Okta", "JAMF", "InTune"] }
          ]
        },
        "sub1_4": {
          category: "Substep 1.4",
          title: "Set clear coordination and decision rules",
          description: "Define who makes final decisions on architecture, product, and budget.",
          sections: [
              { title: "Process Steps", items: ["Define RACI matrix", "Agreed on escalation path", "Set approval thresholds"] },
              { title: "Roles + SME's", items: ["Project Sponsor", "Management"] },
              { title: "Tools", items: ["RACI Template", "Confluence"] }
          ]
        },
        // Substeps - Step 2
        "sub2_1": {
            category: "Substep 2.1",
            title: "Welcome participants and manage transitions",
            description: "Smooth onboarding for technical team members and managing stakeholder expectations during kickoff.",
            sections: [
                { title: "Process Steps", items: ["Intro session", "Access setup", "Context sharing", "Knowledge transfer"] },
                { title: "Roles + SME's", items: ["Project Manager", "Scrum Master", "Onboarding Lead"] },
                { title: "Tools", items: ["Slack", "Email", "Wiki Handover"] }
            ]
        },
        "sub2_2": {
          category: "Substep 2.2",
          title: "Clarify ownership and responsibilities",
          description: "Detailed assignment of tasks to ensure no gaps in project coverage.",
          sections: [
              { title: "Process Steps", items: ["Task breakdown (WBS)", "Assign Jira story points", "Verify individual capacity"] },
              { title: "Roles + SME's", items: ["Workstream Leads", "Product Owner"] },
              { title: "Tools", items: ["Jira", "Azure DevOps"] }
          ]
        },
        // ... Generic Substeps (Filling remaining as professional placeholders)
        "sub3_1": {
          category: "Substep 3.1",
          title: "Review how things currently function",
          description: "Deep dive into existing legacy systems and current process bottlenecks.",
          sections: [
              { title: "Process Steps", items: ["Review legacy code", "Map data flows", "Interview current users"] },
              { title: "Roles + SME's", items: ["Business Analyst", "SME"] },
              { title: "Tools", items: ["Lucidchart", "Miro"] }
          ]
        },
        "sub5_2": {
          category: "Substep 5.2",
          title: "Create a basic sequence of next steps",
          description: "Creating a high-velocity tactical plan for the first two engineering sprints.",
          sections: [
              { title: "Process Steps", items: ["Sprint planning", "Backlog grooming", "Set Sprint Goal"] },
              { title: "Roles + SME's", items: ["Technical Team", "Scrum Master"] },
              { title: "Tools", items: ["Jira", "Github Projects"] }
          ]
        }
    };

    // Generic fallback for any ID not explicitly defined above
    const getFallbackData = (id, element) => {
        const text = element ? element.innerText : id;
        const isStep = id.startsWith('step');
        return {
            category: isStep ? "Phase Step" : "Process Substep",
            title: text,
            description: `Detailed strategy and guidelines for the ${text} phase, ensuring rigorous quality and alignment across the IT ecosystem.`,
            sections: isStep ? [
                { title: "Checklist", items: ["Verify prerequisites", "Obtain stakeholder sign-off", "Review safety protocols"] },
                { title: "Healthy Habits", items: ["Documentation first", "Transparent communication"] }
            ] : [
                { title: "Process Steps", items: ["Review criteria", "Implement change", "Verify results"] },
                { title: "Roles + SME's", items: ["Project Team", "Relevant SME"] },
                { title: "Tools", items: ["Productivity Suite", "Version Control"] }
            ]
        };
    };

    window.openModal = function(id, clickedElement) {
        const data = processData[id] || getFallbackData(id, clickedElement);
        if (!data) return;

        modalCategory.innerText = data.category;
        modalTitle.innerText = data.title;
        
        let html = `<p class="body-text">${data.description}</p>`;
        
        if (data.sections) {
            data.sections.forEach(sec => {
                html += `
                    <div class="modal-section">
                        <span class="modal-section-title">${sec.title}</span>
                        <ul class="modal-list">
                            ${sec.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
            });
        }
        
        modalBody.innerHTML = html;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    window.closeModal = function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Bind diagram clicks
    document.querySelectorAll('[data-modal]').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.getAttribute('data-modal');
            openModal(id, el);
        });
    });

    // --- ScrollSpy & Smooth Scrolling (Found. Playbook Only) ---
    function rebindObserver() {
        if (window.activeObserver) window.activeObserver.disconnect();

        // Check Found. Playbook split panes
        const visibleSplitLayout = Array.from(tabPanes || []).find(pane => pane.style.display !== 'none');
        if (!visibleSplitLayout) return;

        const scrollLinks = visibleSplitLayout.querySelectorAll('.scroll-link');
        const contentSections = visibleSplitLayout.querySelectorAll('.content-section');

        if (contentSections.length > 0 && scrollLinks.length > 0) {
            scrollLinks.forEach(link => {
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollLinks.forEach(l => l.classList.remove('active'));
                    newLink.classList.add('active');
                    const targetId = newLink.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        const headerOffset = 140; 
                        window.scrollTo({ top: targetSection.getBoundingClientRect().top + window.scrollY - headerOffset, behavior: 'smooth' });
                    }
                });
            });

            window.activeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        visibleSplitLayout.querySelectorAll('.scroll-link').forEach(l => l.classList.remove('active'));
                        const activeLink = visibleSplitLayout.querySelector(`.scroll-link[href="#${id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
            }, { root: null, rootMargin: '-150px 0px -60% 0px', threshold: 0 });

            contentSections.forEach(section => window.activeObserver.observe(section));
        }
    }

    rebindObserver();
});
