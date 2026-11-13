# Updating the availability calendar

Edit `availability.json` in the website's root folder, then publish the updated file with the website. No JavaScript changes are needed. Reloading Contact Us loads the latest file.

- `confirmedFrom` and `confirmedThrough`: first and last nights whose availability you have checked, inclusive, using `YYYY-MM-DD` dates.
- `bookings`: one entry per booked stay, with `checkin` and `checkout` dates. The checkout date is not a booked night.
- Within the confirmed range, nights without a booking appear green (Available). Booked nights appear red (Booked). Dates outside the confirmed range appear gray (Not confirmed). Past dates are muted.
- Leave both confirmed dates as `null` until you have checked availability. The initial empty booking list does not mark every date available.
- This file is public. Include dates only, not guest names or other personal details.

Example only — replace these dates with your actual availability:

```json
{
  "confirmedFrom": "2026-11-01",
  "confirmedThrough": "2027-04-30",
  "bookings": [
    { "checkin": "2026-11-10", "checkout": "2026-11-15" },
    { "checkin": "2026-12-20", "checkout": "2026-12-28" }
  ]
}
```

Add entries separated by commas; do not put a comma after the final entry. To cancel a booking, remove its entry. Extend the confirmed range as you review future availability.

The calendar uses Hawaii's current date. It requires the site to be served over HTTP or HTTPS (opening `contact.html` directly as a local file may prevent loading JSON). It does not automatically synchronize with external booking services.
