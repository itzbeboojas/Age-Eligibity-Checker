
const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {
        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading form");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(data);
        });
    }

    else if (req.method === "POST" && req.url === "/check") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = querystring.parse(body);

            const name = (formData.name || "").trim();
            const ageText = (formData.age || "").trim();
            const nationality =
                (formData.nationality || "").trim();
            const gender = (formData.gender || "").trim();

            const age = Number(ageText);

            let message = "";

            if (name === "" || ageText === "") {
                message = "Please fill all required fields.";
            }

            else if (!Number.isInteger(age) || age < 1) {
                message = "Please enter a valid age.";
            }

            else {
                let status = "";

                if (age < 18) {
                    status = "You are a Minor.";
                }

                else if (age < 60) {
                    status = "You are an Adult.";
                }

                else {
                    status = "You are a Senior Citizen.";
                }

                let eligibility = "";

                if (age >= 18) {
                    eligibility =
                    "You are eligible to create your college student account.";
                } else {
                    eligibility =
                    "You are not yet eligible to create your college student account.";
                }

                message = `
                    <h2>Hello ${escapeHTML(name)}!</h2>
                    <h3>${status}</h3>
                    <p>Nationality: ${escapeHTML(nationality || "Not provided")}</p>
                    <p>Gender: ${escapeHTML(gender || "Not provided")}</p>
                    <p>${eligibility}</p>
                `;
            }

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Eligibility Result</title>
                    <style>
                        body {
                            background: #111;
                            color: white;
                            font-family: Arial;
                            text-align: center;
                            padding: 50px 15px;
                        }
                        .result {
                            background: #222;
                            border: 2px solid goldenrod;
                            border-radius: 12px;
                            padding: 25px;
                            max-width: 500px;
                            margin: auto;
                        }
                        h2 { color: gold; }
                        a { color: gold; }
                    </style>
                </head>
                <body>
                    <div class="result">
                        ${message}
                        <br>
                        <a href="/">Go Back</a>
                    </div>
                </body>
                </html>
            `);
        });
    }

    else {
        res.writeHead(404);
        res.end("Page Not Found");
    }
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});