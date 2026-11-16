
/* =====================================
   BREW & BEAN - MAIN JAVASCRIPT
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. BACK TO TOP BUTTON
    ===================================== */

    const backToTop = document.createElement("button");

    backToTop.textContent = "↑";
    backToTop.className = "back-to-top";
    backToTop.type = "button";

    backToTop.setAttribute("aria-label", "Back to top");

    document.body.appendChild(backToTop);

    // Show or hide button when scrolling
    function updateBackToTop() {

        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }

    }

    window.addEventListener("scroll", updateBackToTop);

    updateBackToTop();

    // Scroll smoothly to the top
    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    /* =====================================
       2. MENU SEARCH
    ===================================== */

    const menuSearch = document.getElementById("menuSearch");

    if (menuSearch) {

        // Get all original menu sections
        const menuSections = Array.from(
            document.querySelectorAll(".menu-section")
        );

        // Create search results section
        const searchSection = document.createElement("section");

        searchSection.className = "menu-section";
        searchSection.id = "searchSection";
        searchSection.hidden = true;

        // Create heading
        const searchHeading = document.createElement("h2");

        searchHeading.textContent = "Search Results";
        searchHeading.className = "search-results-title";

        // Create results grid
        const searchResults = document.createElement("div");

        searchResults.className = "menu-grid";
        searchResults.id = "searchResults";

        // Create no results message
        const noResults = document.createElement("p");

        noResults.id = "noMenuResults";
        noResults.textContent =
            "☕ No products found. Try another search!";

        noResults.hidden = true;
        noResults.setAttribute("role", "status");

        // Add elements to search section
        searchSection.appendChild(searchHeading);
        searchSection.appendChild(searchResults);
        searchSection.appendChild(noResults);

        // Place results before the original menu sections
        if (menuSections.length > 0) {

            menuSections[0].parentNode.insertBefore(
                searchSection,
                menuSections[0]
            );

        }

        // Save original product positions
        const originalPositions = new Map();

        function saveOriginalPositions() {

            menuSections.forEach(function (section) {

                const cards = section.querySelectorAll(".menu-card");

                cards.forEach(function (card) {

                    if (!originalPositions.has(card)) {

                        originalPositions.set(
                            card,
                            card.parentElement
                        );

                    }

                });

            });

        }

        // Restore all products to their original sections
        function restoreMenu() {

            originalPositions.forEach(function (parent, card) {

                parent.appendChild(card);
                card.style.display = "";

            });

            // Show all original sections
            menuSections.forEach(function (section) {

                section.style.display = "";

            });

            // Hide search results
            searchSection.hidden = true;
            searchSection.style.display = "none";

            searchResults.replaceChildren();

            noResults.hidden = true;

        }

        // Search function
        function searchMenu() {

            const searchText = menuSearch.value
                .toLowerCase()
                .trim();

            // Save cards before moving them
            saveOriginalPositions();

            // Empty search: restore the original menu
            if (searchText === "") {

                restoreMenu();
                return;

            }

            // Find matching products
            const matchingCards = Array.from(
                originalPositions.keys()
            ).filter(function (card) {

                const productName = card.querySelector("h3");

                if (!productName) {
                    return false;
                }

                const name = productName.textContent
                    .toLowerCase();

                return name.includes(searchText);

            });

            // Hide original menu sections
            menuSections.forEach(function (section) {

                section.style.display = "none";

            });

            // Clear previous results
            searchResults.replaceChildren();

            // Move matching products to the top
            matchingCards.forEach(function (card) {

                card.style.display = "";

                searchResults.appendChild(card);

            });

            // Show search results section
            searchSection.hidden = false;
            searchSection.style.display = "block";

            // Show message if no products match
            noResults.hidden = matchingCards.length > 0;

            // Scroll to results
            searchSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

        // Search while typing
        menuSearch.addEventListener("input", searchMenu);

    }


    /* =====================================
       3. CONTACT FORM VALIDATION
    ===================================== */

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {

        const contactNotice = document.getElementById(
            "contact-form-notice"
        );

        contactForm.addEventListener("submit", function (event) {

            // Prevent page refresh
            event.preventDefault();

            // Get user input values
            const firstName = document.getElementById("first-name")
                .value.trim();

            const lastName = document.getElementById("last-name")
                .value.trim();

            const email = document.getElementById("contact-email")
                .value.trim();

            const subject = document.getElementById("contact-subject")
                .value;

            const message = document.getElementById("contact-message")
                .value.trim();

            // Check empty fields
            if (!firstName || !lastName || !email ||
                !subject || !message) {

                contactNotice.textContent =
                    "Please fill in all required fields.";

                contactNotice.hidden = false;
                return;

            }

            // Check email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                contactNotice.textContent =
                    "Please enter a valid email address.";

                contactNotice.hidden = false;
                return;

            }

            // Show demo success message
            contactNotice.textContent =
                "☕ Thank you, " + firstName +
                "! Your message was received in this demo. " +
                "No email was actually sent.";

            contactNotice.hidden = false;

            // Clear the form
            contactForm.reset();

        });

    }

    /* =====================================
       4. SIGN UP FORM VALIDATION
    ===================================== */

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {

        const signupMessage =
            document.getElementById("signupMessage");

        const signupName =
            document.getElementById("signupName");

        const signupEmail =
            document.getElementById("signupEmail");

        const signupPassword =
            document.getElementById("signupPassword");

        const confirmPassword =
            document.getElementById("confirmPassword");

        function showSignupMessage(text, type) {

            signupMessage.textContent = text;
            signupMessage.className = "auth-message " + type;

        }

        signupForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = signupName.value.trim();
            const email = signupEmail.value.trim();
            const password = signupPassword.value;
            const confirm = confirmPassword.value;

            // Check required fields
            if (!name || !email || !password || !confirm) {

                showSignupMessage(
                    "Please fill in all fields.",
                    "error"
                );

                return;
            }

            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showSignupMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }

            // Validate password length
            if (password.length < 6) {

                showSignupMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }

            // Confirm password
            if (password !== confirm) {

                showSignupMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }

            // Demo success
            showSignupMessage(
                "☕ Demo sign up complete! Redirecting to Login...",
                "success"
            );

            // No account or password is saved
            signupForm.reset();

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1200);

        });

    }

    /* =====================================
       5. LOGIN FORM VALIDATION
    ===================================== */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        const loginEmail =
            document.getElementById("loginEmail");

        const loginPassword =
            document.getElementById("loginPassword");

        const loginMessage =
            document.getElementById("loginMessage");

        function showLoginMessage(text, type) {

            loginMessage.textContent = text;
            loginMessage.className = "auth-message " + type;

        }

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = loginEmail.value.trim();
            const password = loginPassword.value;

            // Check empty fields
            if (!email || !password) {

                showLoginMessage(
                    "Please fill in all fields.",
                    "error"
                );

                return;
            }

            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                showLoginMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }

            // Validate password length
            if (password.length < 6) {

                showLoginMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }

            // Demo login success
            showLoginMessage(
                "☕ Demo login complete! Redirecting to Home...",
                "success"
            );

            // Front-end demo only.
            // No real authentication or credential storage.

            loginForm.reset();

            setTimeout(function () {

                window.location.href = "index.html";

            }, 1200);

        });

    }

    // =====================================
    // 6. REVIEWS JAVASCRIPT
    // =====================================

    if (document.getElementById("reviewForm")) {

        const sampleReviews = [
            {
                name: "Lina A.",
                rating: 5,
                message: "The Spanish latte is so creamy and delicious! Such a cozy place to relax with friends.",
                date: "Sample review"
            },
            {
                name: "Omar K.",
                rating: 5,
                message: "Amazing cappuccino and a lovely atmosphere. Definitely my kind of coffee spot!",
                date: "Sample review"
            },
            {
                name: "Sara M.",
                rating: 5,
                message: "I loved the iced matcha latte and the cheesecake. Everything feels warm and welcoming.",
                date: "Sample review"
            },
            {
                name: "Yousef H.",
                rating: 4,
                message: "Great coffee, tasty desserts, and a really relaxing vibe. I would happily come again.",
                date: "Sample review"
            },
            {
                name: "Maya R.",
                rating: 5,
                message: "The caramel macchiato is my favorite! Perfect for a little afternoon treat.",
                date: "Sample review"
            },
            {
                name: "Adam N.",
                rating: 5,
                message: "A beautiful little cafe concept with so many drinks to choose from. Love the menu!",
                date: "Sample review"
            }
        ];

        const storageKey = "brewBeanCustomerReviews";
        let customerReviews = [];

        try {
            const saved = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (Array.isArray(saved)) {
                customerReviews = saved.filter(review =>
                    review &&
                    typeof review.name === "string" &&
                    typeof review.message === "string" &&
                    Number.isInteger(review.rating) &&
                    review.rating >= 1 &&
                    review.rating <= 5
                );
            }
        } catch (error) {
            customerReviews = [];
        }

        const reviewsGrid = document.getElementById("reviewsGrid");
        const reviewForm = document.getElementById("reviewForm");
        const ratingHint = document.getElementById("ratingHint");
        const reviewFeedback = document.getElementById("reviewFeedback");

        const starButtons = document.querySelectorAll(
            ".reviews-star-picker button"
        );

        let selectedRating = 0;

        // CREATE REVIEW CARD

        function createReviewCard(review) {

            const card = document.createElement("article");
            card.className = "reviews-card";

            const stars = document.createElement("div");
            stars.className = "reviews-card-stars";

            stars.textContent =
                "★".repeat(review.rating) +
                "☆".repeat(5 - review.rating);

            stars.setAttribute(
                "aria-label",
                review.rating + " out of 5 stars"
            );

            const message = document.createElement("p");
            message.className = "reviews-card-message";
            message.textContent = "“" + review.message + "”";

            const bottom = document.createElement("div");
            bottom.className = "reviews-card-bottom";

            const avatar = document.createElement("div");
            avatar.className = "reviews-avatar";
            avatar.textContent =
                review.name.trim().charAt(0).toUpperCase() || "?";

            const person = document.createElement("div");
            person.className = "reviews-person";

            const name = document.createElement("strong");
            name.textContent = review.name;

            const date = document.createElement("small");
            date.textContent = review.date || "Customer review";

            person.appendChild(name);
            person.appendChild(date);

            bottom.appendChild(avatar);
            bottom.appendChild(person);

            card.appendChild(stars);
            card.appendChild(message);
            card.appendChild(bottom);

            return card;
        }

        // DISPLAY REVIEWS

        function renderReviews() {

            reviewsGrid.innerHTML = "";

            const allReviews = [
                ...customerReviews.slice().reverse(),
                ...sampleReviews
            ];

            allReviews.forEach(review => {
                reviewsGrid.appendChild(
                    createReviewCard(review)
                );
            });

            const total = allReviews.reduce(
                (sum, review) => sum + review.rating,
                0
            );

            const average = total / allReviews.length;
            const roundedAverage = Math.round(average);

            document.getElementById("averageRating").textContent =
                average.toFixed(1);

            document.getElementById("reviewCount").textContent =
                allReviews.length;

            const averageStars =
                document.getElementById("averageStars");

            averageStars.textContent =
                "★".repeat(roundedAverage) +
                "☆".repeat(5 - roundedAverage);

            averageStars.setAttribute(
                "aria-label",
                average.toFixed(1) + " out of 5 stars"
            );
        }

        // UPDATE SELECTED STARS

        function updateStars() {

            starButtons.forEach(button => {

                const value = Number(button.dataset.rating);

                button.classList.toggle(
                    "selected",
                    value <= selectedRating
                );

                button.setAttribute(
                    "aria-pressed",
                    String(value === selectedRating)
                );
            });

            ratingHint.textContent = selectedRating
                ? selectedRating + " out of 5 stars selected"
                : "Choose your rating";
        }

        // STAR CLICK EVENTS

        starButtons.forEach(button => {

            button.addEventListener("click", function () {

                selectedRating = Number(this.dataset.rating);
                updateStars();

            });
        });

        // SUBMIT REVIEW

        reviewForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById(
                "reviewName"
            ).value.trim();

            const message = document.getElementById(
                "reviewMessage"
            ).value.trim();

            if (!name || !message) {

                reviewFeedback.textContent =
                    "Please complete all fields.";

                reviewFeedback.className =
                    "reviews-feedback error";

                return;
            }

            if (selectedRating === 0) {

                reviewFeedback.textContent =
                    "Please select a star rating.";

                reviewFeedback.className =
                    "reviews-feedback error";

                return;
            }

            const newReview = {
                name: name,
                rating: selectedRating,
                message: message,
                date: new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                })
            };

            customerReviews.push(newReview);

            let savedSuccessfully = true;

            try {
                localStorage.setItem(
                    storageKey,
                    JSON.stringify(customerReviews)
                );
            } catch (error) {
                savedSuccessfully = false;
            }

            renderReviews();

            reviewForm.reset();

            selectedRating = 0;
            updateStars();

            reviewFeedback.textContent = savedSuccessfully
                ? "Thank you! Your review has been added."
                : "Your review was added for this session, but could not be saved.";

            reviewFeedback.className =
                "reviews-feedback success";

            document.getElementById(
                "customer-reviews"
            ).scrollIntoView({
                behavior: "smooth"
            });

        });

        // INITIAL DISPLAY

        updateStars();
        renderReviews();

    }

    // =====================================
    // 7. REWARDS JAVASCRIPT
    // =====================================

    if (document.getElementById("addPointsBtn")) {

        const rewardsStorageKey = "brewBeanDemoPoints";

        let points = 0;

        try {
            const savedPoints = Number(
                localStorage.getItem(rewardsStorageKey)
            );

            if (
                Number.isSafeInteger(savedPoints) &&
                savedPoints >= 0
            ) {
                points = savedPoints;
            }
        } catch (error) {
            points = 0;
        }

        const pointsBalance =
            document.getElementById("pointsBalance");

        const progressPoints =
            document.getElementById("progressPoints");

        const progressFill =
            document.getElementById("progressFill");

        const progressMessage =
            document.getElementById("progressMessage");

        const progressBar =
            document.getElementById("rewardsProgress");

        const actionMessage =
            document.getElementById("rewardsActionMessage");

        const addPointsBtn =
            document.getElementById("addPointsBtn");

        const redeemButtons =
            document.querySelectorAll(".rewards-redeem-btn");

        // SAVE POINTS

        function savePoints() {
            try {
                localStorage.setItem(
                    rewardsStorageKey,
                    String(points)
                );

                return true;
            } catch (error) {
                return false;
            }
        }

        // UPDATE REWARDS DISPLAY

        function updateRewards() {

            pointsBalance.textContent = points;

            const currentProgress = Math.min(points, 30);

            progressPoints.textContent = currentProgress;

            const percentage = (currentProgress / 30) * 100;

            progressFill.style.width = percentage + "%";

            progressBar.setAttribute(
                "aria-valuenow",
                String(currentProgress)
            );

            if (points >= 30) {

                progressMessage.textContent =
                    "You have enough points to redeem a cookie!";

            } else {

                const remaining = 30 - points;

                progressMessage.textContent =
                    "You're " + remaining +
                    " points away from a free cookie!";
            }

            redeemButtons.forEach(button => {

                const cost = Number(button.dataset.cost);
                const canRedeem = points >= cost;

                button.disabled = !canRedeem;

                button.textContent = canRedeem
                    ? "Redeem"
                    : "Need " + (cost - points) + " pts";
            });
        }

        // ADD 10 DEMO POINTS

        addPointsBtn.addEventListener("click", function () {

            if (points > Number.MAX_SAFE_INTEGER - 10) {
                return;
            }

            points += 10;

            const saved = savePoints();

            updateRewards();

            actionMessage.textContent = saved
                ? "10 demo points added to your wallet!"
                : "10 points added for this session, but could not be saved.";

            actionMessage.className =
                "rewards-action-message success";
        });

        // REDEEM REWARDS

        redeemButtons.forEach(button => {

            button.addEventListener("click", function () {

                const cost = Number(this.dataset.cost);
                const rewardName = this.dataset.reward;

                if (points < cost) {
                    return;
                }

                points -= cost;

                const saved = savePoints();

                updateRewards();

                actionMessage.textContent = saved
                    ? "You redeemed: " + rewardName +
                    "! (Demo only — no real product issued.)"
                    : "Demo reward redeemed for this session, but your balance could not be saved.";

                actionMessage.className =
                    "rewards-action-message success";
            });
        });

        // INITIAL DISPLAY

        updateRewards();

    }



});
