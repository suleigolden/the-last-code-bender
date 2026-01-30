import { Copy, Check, Linkedin, Github, Youtube, Twitter, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const socialsData = {
  linkedin: "https://linkedin.com/in/YOUR_LINKEDIN",
  github: "https://github.com/YOUR_GITHUB",
  youtube: "https://youtube.com/@YOUR_YOUTUBE",
  twitter_x: "https://x.com/YOUR_TWITTER",
  email: "mailto:your.email@example.com"
};

const jsonString = JSON.stringify(socialsData, null, 2);

const socialLinks = [
  { 
    key: "linkedin", 
    name: "LinkedIn", 
    icon: Linkedin, 
    url: socialsData.linkedin,
    color: "hover:text-[#0077B5] hover:border-[#0077B5]"
  },
  { 
    key: "github", 
    name: "GitHub", 
    icon: Github, 
    url: socialsData.github,
    color: "hover:text-foreground hover:border-foreground"
  },
  { 
    key: "youtube", 
    name: "YouTube", 
    icon: Youtube, 
    url: socialsData.youtube,
    color: "hover:text-[#FF0000] hover:border-[#FF0000]"
  },
  { 
    key: "twitter_x", 
    name: "X / Twitter", 
    icon: Twitter, 
    url: socialsData.twitter_x,
    color: "hover:text-foreground hover:border-foreground"
  },
  { 
    key: "email", 
    name: "Email", 
    icon: Mail, 
    url: socialsData.email,
    color: "hover:text-primary hover:border-primary"
  },
];

export const SocialsSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 px-4" id="socials">
      {/* Header */}
      <div className="font-mono text-sm text-syntax-comment mb-6">
        {"// socials/links.json — Let's connect"}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* JSON Code Block */}
        <div className="ide-panel overflow-hidden">
          {/* Header */}
          <div className="bg-ide-tab px-4 py-2 flex items-center justify-between border-b border-border">
            <span className="text-xs font-mono text-muted-foreground">links.json</span>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-syntax-string" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* JSON Content */}
          <div className="p-4 font-mono text-sm">
            <pre className="leading-7">
              <span className="text-foreground">{"{"}</span>
              {Object.entries(socialsData).map(([key, value], index, arr) => (
                <div key={key} className="pl-4">
                  <span className="syntax-variable">"{key}"</span>
                  <span className="text-foreground">: </span>
                  <span className="syntax-string">"{value}"</span>
                  {index < arr.length - 1 && <span className="text-foreground">,</span>}
                </div>
              ))}
              <span className="text-foreground">{"}"}</span>
            </pre>
          </div>
        </div>

        {/* Social Cards */}
        <div className="space-y-4">
          <h3 className="font-mono text-sm text-syntax-comment mb-4">
            {"// Quick Links"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.key}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  ide-panel p-4 flex items-center gap-4 transition-all duration-300
                  border-transparent ${social.color}
                  group
                `}
              >
                <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                  <social.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{social.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {social.url.replace('https://', '').replace('mailto:', '')}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-current transition-colors" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="ide-panel p-6 mt-6 border-l-4 border-l-primary">
            <p className="font-mono text-syntax-comment mb-2">{"// Ready to collaborate?"}</p>
            <p className="text-foreground mb-4">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <a href={socialsData.email}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-mono">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
