const axios = require("axios");

const runCode = async (req, res) => {
  try {
    // yha mene check krne k liye ye basic code likha h
    const {code,language}=req.body;// ye python ka code judge0 m har language k code h

    // ye upar ki value code aur language code frontend se aa jayengi uska bn chuka h

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,   //ye user ka code jo frontend se aata h
        language_id: language,      //yha language code
        stdin: "",  //aur ye jo hum input dete h woh h 
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": "977dba6b60msh8960c5729028f24p11009bjsnfb3f5ad01f57",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const result = response.data;
    res.json(result); 
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Code execution failed" });
  }
};

// ye upr judge 0 ka code h ise aese hi chodna h uski website pr tha

module.exports = { runCode };
