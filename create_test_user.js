// Run this file with: node create_test_user.js
const createTestUser = async () => {
    const randomNum = Math.floor(Math.random() * 10000);
    const newUser = {
        username: `TestUser_${randomNum}`,
        first_name: "Test",
        last_name: "User",
        email: `testuser${randomNum}@example.com`,
        password: "password",
        bio: "Auto-generated test user",
        profile_image_url: "",
        type: "author"
    };

    try {
        const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const data = await response.json();

        if (data.token) {
            console.log("------------------------------------------------");
            console.log("✅ User Created Successfully!");
            console.log(`Username: ${newUser.username}`);
            console.log(`Email:    ${newUser.email}`);
            console.log(`Password: ${newUser.password}`);
            console.log(`Token:    ${data.token}`);
            console.log("------------------------------------------------");
        } else {
            console.log("❌ Failed to create user.");
            console.log("Server Response:", data);
        }
    } catch (error) {
        console.error("❌ Error:", error.message);
        console.log("Make sure your server is running at http://localhost:8000");
    }
};

createTestUser();