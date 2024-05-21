import axios from 'axios';
import { load } from 'cheerio';
import nodemailer from 'nodemailer';

let monitoringData = {
    url: '',
    email: '',
};

const checkTicketsHandler = async (req, res) => {
    if (req.method === 'POST') {
        const { url, email } = req.body;
        monitoringData = { url, email };
        console.log(`Monitoring URL: ${url}, Notification Email: ${email}`);
        return res
            .status(200)
            .json({ message: 'URL and email set successfully' });
    }

    if (monitoringData.url && monitoringData.email) {
        try {
            const response = await axios.get(monitoringData.url);
            const html = response.data;
            const $ = load(html);

            const isTicketAvailable =
                $('body').text().includes('ticket available') ||
                $('body').text().includes('tickets available');
            const isPriceAvailable = $('body').text().includes('from $');

            if (isTicketAvailable && isPriceAvailable) {
                await sendNotification(
                    monitoringData.email,
                    monitoringData.url
                );
            }
        } catch (error) {
            console.error('Error checking tickets:', error);
        }
    }

    res.status(405).send('Method Not Allowed');
};

const sendNotification = async (email, url) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: import.meta.env.VITE_OUTLOOK_USER,
            pass: import.meta.env.OUTLOOK_PASS,
        },
    });
    const mailOptions = {
        from: import.meta.env.VITE_OUTLOOK_USER,
        to: email,
        subject: 'Ticket Available!',
        text: `Tickets are now available at ${url}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default checkTicketsHandler;
