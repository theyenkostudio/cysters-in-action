import { defineQuery } from 'next-sanity'

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  siteName,
  tagline,
  logo,
  logoOnDark,
  favicon,
  contactEmail,
  phone,
  whatsapp,
  address,
  socialLinks,
  medicalDisclaimer,
}`)

export const navigationQuery = defineQuery(`*[_type == "navigation"][0]{
  mainNav[]{
    label,
    link{ label, type, external, openInNewTab, internal->{ _type, slug } },
    items[]{
      title,
      description,
      icon,
      link{ label, type, external, openInNewTab, internal->{ _type, slug } },
    },
  },
  secondaryLink{ label, type, external, openInNewTab, internal->{ _type, slug } },
  primaryCta{
    style,
    action,
    link{ label, type, external, openInNewTab, internal->{ _type, slug } },
  },
}`)

export const footerQuery = defineQuery(`*[_type == "footer"][0]{
  blurb,
  columns[]{
    heading,
    links[]{ label, type, external, openInNewTab, internal->{ _type, slug } },
  },
  showNewsletter,
  newsletterHeading,
  legalLinks[]{ label, type, external, openInNewTab, internal->{ _type, slug } },
  copyrightText,
  credit{ label, type, external, openInNewTab, internal->{ _type, slug } },
}`)

export const announcementBarQuery = defineQuery(`*[_type == "announcementBar" && enabled == true
  && (!defined(startDate) || startDate <= now())
  && (!defined(endDate) || endDate >= now())][0]{
  label,
  message,
  link{ label, type, external, openInNewTab, internal->{ _type, slug } },
  dismissible,
  tone,
}`)
