# VandyCourses

VandyCourses is a tool for Vanderbilt students to view the grade distributions of courses based on professor and term.

## Privacy Info

VandyCourses is fully anonymous. No other users are able to see who has posted a grade or what grades they have posted. Furthermore, all emails are stored in hashed form in the database, meaning that even someone with access to the database would not be able to determine who posted a certain grade. The hashing process is one-way and irreversible ( john.doe@vanderbilt.edu -> 2c3b2e94fb482c5844ce5c6e607bbc639f78e0831d48e4140cdae0607aa54fb7 ). Furthermore, this site utilizes Google's OAuth2 API, which means that the site does not have access to any password or sign-in info. The only information the site is exposed to is an Authorization Token which it sends to Google to ensure a user successfully signed into their account and the actual email they used to sign in, which it uses to ensure the user is a Vanderbilt student and to hash and store in the database.

## Contributing

Pull requests are welcome.
