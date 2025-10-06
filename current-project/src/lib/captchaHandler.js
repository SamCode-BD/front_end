async function captchaHandler(req, res) {
    //Captcha ----------------------------------------------
        const secretKey = process.env.REACT_CAPTCHA_SECRET_KEY;
    
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captchaToken}`;
        const captchaResponse = await fetch(verifyUrl, { method: 'POST' });
        const captchaData = await captchaResponse.json();
    
        if (!captchaData.success) {

          res.status(400).json({ message: 'CAPTCHA verification failed' });
          console.log(captchaData);
          throw new Error("Captcha failed");
          
        }
        //-----------------------------------------------------
}
module.exports={captchaHandler};
