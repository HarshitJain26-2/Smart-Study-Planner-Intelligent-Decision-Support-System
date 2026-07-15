/*
 * Smart Study Planner - Interactive Client JavaScript
 * Integrates input listeners, Flask analysis endpoint, Chart.js, AOS and html2pdf.js
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize AOS Animations
    AOS.init({
        duration: 800,
        easing: 'ease-out-quad',
        once: true
    });

    // 2. DOM Elements Selection
    const form = document.getElementById('studyPlannerForm');
    const studentNameInput = document.getElementById('studentName');
    const subjectNameInput = document.getElementById('subjectName');
    const daysLeftInput = document.getElementById('daysLeft');
    const daysVal = document.getElementById('daysVal');
    
    const syllabusCompletedInput = document.getElementById('syllabusCompleted');
    const syllabusRange = document.getElementById('syllabusRange');
    const syllabusVal = document.getElementById('syllabusVal');
    
    const studyHoursInput = document.getElementById('studyHours');
    const hoursRange = document.getElementById('hoursRange');
    const hoursVal = document.getElementById('hoursVal');
    
    const difficultyInput = document.getElementById('difficulty');
    const starButtons = document.querySelectorAll('.btn-star');
    
    const btnAnalyze = document.getElementById('btnAnalyze');
    const analyzeSpinner = document.getElementById('analyzeSpinner');
    const btnReset = document.getElementById('btnReset');
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Output Elements
    const overallScoreText = document.getElementById('overallScore');
    const scoreCircle = document.getElementById('scoreCircle');
    const preparationBadge = document.getElementById('preparationBadge');
    const preparationTitle = document.getElementById('preparationTitle');
    const readinessSubtext = document.getElementById('readinessSubtext');
    const statusCardGlow = document.getElementById('statusCardGlow');
    
    const statSyllabusBar = document.getElementById('statSyllabusBar');
    const statSyllabusVal = document.getElementById('statSyllabusVal');
    const statStudyHoursBar = document.getElementById('statStudyHoursBar');
    const statStudyHoursVal = document.getElementById('statStudyHoursVal');
    const statDaysLeftBar = document.getElementById('statDaysLeftBar');
    const statDaysLeftVal = document.getElementById('statDaysLeftVal');
    
    const recommendationsList = document.getElementById('recommendationsList');
    const scheduleMorning = document.getElementById('scheduleMorning');
    const scheduleAfternoon = document.getElementById('scheduleAfternoon');
    const scheduleEvening = document.getElementById('scheduleEvening');
    const scheduleNight = document.getElementById('scheduleNight');
    const studyTipsContainer = document.getElementById('studyTipsContainer');
    
    const motivationalQuote = document.getElementById('motivationalQuote');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const reportSection = document.getElementById('reportSection');
    
    // Printable Fields
    const printStudentName = document.getElementById('printStudentName');
    const printSubjectName = document.getElementById('printSubjectName');
    const currentDateTexts = document.querySelectorAll('.currentDateText');

    // Chart toggle buttons
    const btnSyllabusChart = document.getElementById('btnSyllabusChart');
    const btnStudyHoursChart = document.getElementById('btnStudyHoursChart');
    const btnDistributionChart = document.getElementById('btnDistributionChart');
    const chartBoxes = document.querySelectorAll('.chart-box');

    // Chart.js Instances
    let syllabusChartInstance = null;
    let studyHoursChartInstance = null;
    let distributionChartInstance = null;

    // Bootstrap Tooltips initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-theme-toggle]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // 3. Theme Toggle Setup
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleUI(savedTheme);

    themeToggleBtn.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleUI(newTheme);
        
        // Refresh charts colors when theme changes
        if (reportSection.style.opacity === '1') {
            refreshChartThemes();
        }
    });

    function updateThemeToggleUI(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun text-yellow';
        } else {
            icon.className = 'fa-solid fa-moon text-primary';
        }
    }

    // 4. Input Sync Listeners
    daysLeftInput.addEventListener('input', function () {
        daysVal.textContent = daysLeftInput.value + (daysLeftInput.value == 1 ? " Day" : " Days");
    });

    syllabusCompletedInput.addEventListener('input', function () {
        let val = Math.min(100, Math.max(0, parseFloat(syllabusCompletedInput.value) || 0));
        syllabusRange.value = val;
        syllabusVal.textContent = val + "%";
    });
    
    syllabusRange.addEventListener('input', function () {
        syllabusCompletedInput.value = syllabusRange.value;
        syllabusVal.textContent = syllabusRange.value + "%";
    });

    studyHoursInput.addEventListener('input', function () {
        let val = Math.min(24, Math.max(0, parseFloat(studyHoursInput.value) || 0));
        hoursRange.value = Math.min(12, val);
        hoursVal.textContent = val + (val == 1 ? " Hour" : " Hours");
    });
    
    hoursRange.addEventListener('input', function () {
        studyHoursInput.value = hoursRange.value;
        hoursVal.textContent = hoursRange.value + (hoursRange.value == 1 ? " Hour" : " Hours");
    });

    // Rating star handler
    starButtons.forEach(button => {
        button.addEventListener('click', function () {
            const val = parseInt(this.getAttribute('data-value'));
            difficultyInput.value = val;
            starButtons.forEach(btn => {
                const btnVal = parseInt(btn.getAttribute('data-value'));
                if (btnVal <= val) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    });

    // 5. Input Validations Custom Actions
    function clearErrors() {
        document.querySelectorAll('.invalid-feedback-custom').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.input-group-glass').forEach(el => el.classList.remove('is-invalid'));
    }

    function showError(inputId, message) {
        const errorEl = document.getElementById('err_' + inputId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        const inputField = document.getElementById(inputId);
        if (inputField) {
            const container = inputField.closest('.input-group-glass');
            if (container) container.classList.add('is-invalid');
        }
    }

    function clientSideValidate() {
        let valid = true;
        clearErrors();

        if (!studentNameInput.value.trim()) {
            showError('student_name', 'Student name is required.');
            valid = false;
        }

        if (!subjectNameInput.value.trim()) {
            showError('subject_name', 'Subject/Course title is required.');
            valid = false;
        }

        const daysValInt = parseInt(daysLeftInput.value);
        if (isNaN(daysValInt) || daysValInt < 1 || daysValInt > 365) {
            showError('days_left', 'Days left must be an integer between 1 and 365.');
            valid = false;
        }

        const syllabusValFloat = parseFloat(syllabusCompletedInput.value);
        if (isNaN(syllabusValFloat) || syllabusValFloat < 0 || syllabusValFloat > 100) {
            showError('syllabus_completed', 'Syllabus completion must be a percentage between 0 and 100.');
            valid = false;
        }

        const hoursValFloat = parseFloat(studyHoursInput.value);
        if (isNaN(hoursValFloat) || hoursValFloat < 0 || hoursValFloat > 24) {
            showError('study_hours', 'Study hours must be a number between 0 and 24.');
            valid = false;
        }

        return valid;
    }

    // 6. Form Submission and Engine execution
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!clientSideValidate()) {
            return;
        }

        // Toggle button states
        btnAnalyze.disabled = true;
        analyzeSpinner.classList.remove('d-none');

        const requestData = {
            student_name: studentNameInput.value,
            subject_name: subjectNameInput.value,
            days_left: parseInt(daysLeftInput.value),
            syllabus_completed: parseFloat(syllabusCompletedInput.value),
            study_hours: parseFloat(studyHoursInput.value),
            difficulty: parseInt(difficultyInput.value)
        };

        fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(JSON.stringify(errData.errors || {}));
                });
            }
            return response.json();
        })
        .then(data => {
            renderAnalysisResults(data);
        })
        .catch(error => {
            console.error("Analysis Error:", error);
            try {
                const errors = JSON.parse(error.message);
                Object.keys(errors).forEach(key => {
                    showError(key, errors[key]);
                });
            } catch (e) {
                alert("Failed to analyze data. Please verify your connection.");
            }
        })
        .finally(() => {
            btnAnalyze.disabled = false;
            analyzeSpinner.classList.add('d-none');
        });
    });

    // 7. Results Renderer
    function renderAnalysisResults(data) {
        // Unlock bottom section
        reportSection.style.opacity = '1';
        reportSection.style.pointerEvents = 'auto';

        const analysis = data.analysis;
        const inputs = data.inputs;
        const recs = data.recommendation;

        // Set printable fields
        printStudentName.textContent = data.student_name;
        printSubjectName.textContent = data.subject_name;
        
        const todayStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        currentDateTexts.forEach(el => el.textContent = todayStr);

        // Update score counter (animating)
        animateValue(overallScoreText, 0, Math.round(analysis.score), 1000);
        updateScoreCircle(analysis.score);

        // Update badge and colors
        preparationBadge.textContent = analysis.level;
        preparationBadge.className = `badge badge-status mb-2 px-3 py-2 fs-6 badge-${analysis.level.toLowerCase()}`;
        
        // Remove older badge color overrides
        preparationBadge.classList.remove('bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'success', 'success-light', 'warning', 'danger');
        
        // Determine badge styling based on status level
        if (analysis.level === 'Excellent') {
            preparationBadge.classList.add('bg-success');
            statusCardGlow.style.background = 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.25) 0%, transparent 60%)';
        } else if (analysis.level === 'Good') {
            preparationBadge.classList.add('bg-info');
            statusCardGlow.style.background = 'radial-gradient(circle at top right, rgba(6, 182, 212, 0.25) 0%, transparent 60%)';
        } else if (analysis.level === 'Moderate') {
            preparationBadge.classList.add('bg-warning');
            statusCardGlow.style.background = 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.25) 0%, transparent 60%)';
        } else { // Critical
            preparationBadge.classList.add('bg-danger');
            statusCardGlow.style.background = 'radial-gradient(circle at top right, rgba(244, 63, 94, 0.3) 0%, transparent 60%)';
        }

        preparationTitle.textContent = analysis.status_title;
        readinessSubtext.textContent = `A preparation score of ${analysis.score}/100 suggests a '${analysis.level}' strategy.`;

        // Update Progress Bars & Cards
        statSyllabusVal.textContent = inputs.syllabus_completed + "%";
        statSyllabusBar.style.width = inputs.syllabus_completed + "%";

        statStudyHoursVal.textContent = inputs.study_hours + " hrs/day";
        // Convert to percentage against standard 10 hrs baseline
        const hoursPercentage = Math.min(100, (inputs.study_hours / 10) * 100);
        statStudyHoursBar.style.width = hoursPercentage + "%";

        statDaysLeftVal.textContent = inputs.days_left + (inputs.days_left == 1 ? " day left" : " days left");
        // Count relative to a 30-day baseline (closer to 0 is higher pressure, but bar shows how much time you have left)
        const daysPercentage = Math.min(100, (inputs.days_left / 30) * 100);
        statDaysLeftBar.style.width = daysPercentage + "%";
        if (inputs.days_left <= 3) {
            statDaysLeftBar.className = "progress-bar bg-gradient-danger";
        } else if (inputs.days_left <= 7) {
            statDaysLeftBar.className = "progress-bar bg-gradient-warning";
        } else {
            statDaysLeftBar.className = "progress-bar bg-gradient-primary";
        }

        // Render advice items list
        recommendationsList.innerHTML = '';
        recs.action_items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item bg-transparent px-0 py-2 border-0 d-flex align-items-start';
            
            let iconColor = 'text-primary';
            if (analysis.level === 'Critical') iconColor = 'text-danger';
            else if (analysis.level === 'Moderate') iconColor = 'text-warning';
            else if (analysis.level === 'Excellent') iconColor = 'text-success';

            li.innerHTML = `<i class="fa-solid fa-circle-check ${iconColor} me-2 mt-1"></i> <span class="text-primary-contrast">${item}</span>`;
            recommendationsList.appendChild(li);
        });

        // Update Routine schedule blocks
        scheduleMorning.textContent = recs.schedule.morning;
        scheduleAfternoon.textContent = recs.schedule.afternoon;
        scheduleEvening.textContent = recs.schedule.evening;
        scheduleNight.textContent = recs.schedule.night;

        // Render Study Tips
        studyTipsContainer.innerHTML = '';
        recs.tips.forEach(tip => {
            const tipBox = document.createElement('div');
            tipBox.className = 'col-md-4';
            tipBox.innerHTML = `
                <div class="p-2 h-100 rounded bg-glass-inner">
                    <p class="mb-0 small-text text-contrast fw-semibold mb-1"><i class="fa-solid fa-circle-arrow-right text-success me-1"></i> Strategy Rule</p>
                    <p class="mb-0 text-muted small-text line-height-sm">${tip}</p>
                </div>
            `;
            studyTipsContainer.appendChild(tipBox);
        });

        // Set quote
        motivationalQuote.textContent = `"${recs.quote.text}"`;
        quoteAuthor.textContent = `— ${recs.quote.author}`;

        // Initialize / Refresh Charts
        generateCharts(inputs, analysis);
        
        // Scroll slightly to the results container
        reportSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function updateScoreCircle(score) {
        // SVG Circumference is 2 * Math.PI * r = 2 * 3.14 * 50 = 314
        const circumference = 314;
        const offset = circumference - (score / 100) * circumference;
        scoreCircle.style.strokeDashoffset = offset;
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // 8. Reset Fields Handler
    btnReset.addEventListener('click', function () {
        form.reset();
        clearErrors();
        
        // Restore range sliders default texts
        daysVal.textContent = "10 Days";
        syllabusVal.textContent = "60%";
        hoursVal.textContent = "5 Hours";

        // Set default rating stars
        difficultyInput.value = 4;
        starButtons.forEach(btn => {
            const btnVal = parseInt(btn.getAttribute('data-value'));
            if (btnVal <= 4) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Fade results panel back
        reportSection.style.opacity = '0.5';
        reportSection.style.pointerEvents = 'none';

        // Reset score badge
        overallScoreText.innerHTML = "0";
        updateScoreCircle(0);
        preparationBadge.textContent = "Pending";
        preparationBadge.className = "badge badge-status mb-2 px-3 py-2 fs-6 bg-secondary text-white";
        preparationTitle.textContent = "Awaiting Input Parameters";
        readinessSubtext.textContent = "Complete configuration fields and press 'Analyze & Plan' to run.";
        statusCardGlow.style.background = 'none';
        
        statSyllabusBar.style.width = "0%";
        statSyllabusVal.textContent = "0%";
        statStudyHoursBar.style.width = "0%";
        statStudyHoursVal.textContent = "0 hours";
        statDaysLeftBar.style.width = "0%";
        statDaysLeftVal.textContent = "0 days left";
    });

    // 9. Chart Visualization Setup
    function generateCharts(inputs, analysis) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textThemeColor = isDark ? '#94a3b8' : '#64748b';
        const gridThemeColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)';

        // 9a. Syllabus completion doughnut
        if (syllabusChartInstance) syllabusChartInstance.destroy();
        const ctxSyllabus = document.getElementById('syllabusChart').getContext('2d');
        syllabusChartInstance = new Chart(ctxSyllabus, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [inputs.syllabus_completed, 100 - inputs.syllabus_completed],
                    backgroundColor: [
                        '#10b981',
                        isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)'
                    ],
                    borderColor: isDark ? '#0f172a' : '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textThemeColor, font: { family: 'Outfit' } }
                    }
                },
                cutout: '75%'
            }
        });

        // 9b. Study Hours Bar Chart
        if (studyHoursChartInstance) studyHoursChartInstance.destroy();
        const ctxHours = document.getElementById('studyHoursChart').getContext('2d');
        
        // Recommended hours determined by rule density limits
        let recommendedHours = 4.0;
        if (analysis.level === 'Critical') recommendedHours = 8.0;
        else if (analysis.level === 'Moderate') recommendedHours = 6.0;

        studyHoursChartInstance = new Chart(ctxHours, {
            type: 'bar',
            data: {
                labels: ['Your Available Hours', 'Recommended Hours'],
                datasets: [{
                    label: 'Study Hours Allocation',
                    data: [inputs.study_hours, recommendedHours],
                    backgroundColor: ['#06b6d4', '#8b5cf6'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: textThemeColor, font: { family: 'Outfit' } }
                    },
                    y: {
                        grid: { color: gridThemeColor },
                        ticks: { color: textThemeColor, font: { family: 'Outfit' } }
                    }
                }
            }
        });

        // 9c. Pie Chart: Study vs Revision vs practice time
        if (distributionChartInstance) distributionChartInstance.destroy();
        const ctxDist = document.getElementById('distributionChart').getContext('2d');
        
        let studyWeight = 30;
        let revWeight = 40;
        let practiceWeight = 30;

        if (analysis.level === 'Excellent') {
            studyWeight = 0; revWeight = 50; practiceWeight = 50;
        } else if (analysis.level === 'Good') {
            studyWeight = 30; revWeight = 40; practiceWeight = 30;
        } else if (analysis.level === 'Moderate') {
            studyWeight = 50; revWeight = 35; practiceWeight = 15;
        } else { // Critical
            studyWeight = 20; revWeight = 50; practiceWeight = 30;
        }

        distributionChartInstance = new Chart(ctxDist, {
            type: 'pie',
            data: {
                labels: ['Core Syllabus Study', 'Topic Revision', 'Mock Practicing'],
                datasets: [{
                    data: [studyWeight, revWeight, practiceWeight],
                    backgroundColor: ['#3b82f6', '#f59e0b', '#ec4899'],
                    borderColor: isDark ? '#0f172a' : '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textThemeColor, font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

    function refreshChartThemes() {
        if (!form.checkValidity()) return;
        const inputs = {
            syllabus_completed: parseFloat(syllabusCompletedInput.value),
            study_hours: parseFloat(studyHoursInput.value),
            days_left: parseInt(daysLeftInput.value)
        };
        const analysis = {
            level: preparationBadge.textContent,
            score: parseFloat(overallScoreText.textContent)
        };
        generateCharts(inputs, analysis);
    }

    // 10. Tab toggle buttons for charts
    btnSyllabusChart.addEventListener('click', function () {
        toggleChartBox('syllabusChartBox', btnSyllabusChart);
    });
    btnStudyHoursChart.addEventListener('click', function () {
        toggleChartBox('studyHoursChartBox', btnStudyHoursChart);
    });
    btnDistributionChart.addEventListener('click', function () {
        toggleChartBox('distributionChartBox', btnDistributionChart);
    });

    function toggleChartBox(boxId, activeBtn) {
        // Toggle buttons
        document.querySelectorAll('.btn-group-toggle-charts .btn').forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');

        // Toggle canvases
        chartBoxes.forEach(box => {
            if (box.id === boxId) {
                box.classList.remove('d-none');
                box.classList.add('active');
            } else {
                box.classList.add('d-none');
                box.classList.remove('active');
            }
        });
    }

    // 11. PDF Export Actions
    const btnDownloadPDF = document.getElementById('btnDownloadPDF');
    btnDownloadPDF.addEventListener('click', function () {
        const student = studentNameInput.value.replace(/\s+/g, '_') || 'Student';
        const subject = subjectNameInput.value.replace(/\s+/g, '_') || 'Course';
        
        const element = document.getElementById('reportPrintArea');
        const opt = {
            margin:       0.5,
            filename:     `Smart_Study_Plan_${student}_${subject}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Run html2pdf
        html2pdf().set(opt).from(element).save();
    });

    // 12. Save Report Action
    const btnSaveReport = document.getElementById('btnSaveReport');
    btnSaveReport.addEventListener('click', function () {
        // Simulate local storage saving of history
        const savedReports = JSON.parse(localStorage.getItem('saved_reports') || '[]');
        const report = {
            id: Date.now(),
            student_name: studentNameInput.value,
            subject_name: subjectNameInput.value,
            score: overallScoreText.textContent,
            level: preparationBadge.textContent,
            date: new Date().toISOString()
        };
        savedReports.push(report);
        localStorage.setItem('saved_reports', JSON.stringify(savedReports));

        // Display browser alert indicating success
        alert(`Success! Study plan report for ${studentNameInput.value} - ${subjectNameInput.value} has been saved locally to this browser's session history.`);
    });
});
