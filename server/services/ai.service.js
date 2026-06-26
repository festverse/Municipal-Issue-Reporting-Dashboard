// ============================================================================
// AI Heuristic Simulation Service
// Provides instant, deterministic, high-quality AI analysis without external API dependencies/rate limits
// ============================================================================

class AIService {
  /**
   * Analyzes ticket title and description to auto-suggest Category, Priority, and Response Tips.
   */
  async analyzeIssue(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    let categoryId = 1; // Default: Pothole / Road Damage
    let priority = 'MEDIUM';
    let confidence = 85;
    let explanation = 'Issue analyzed based on general municipal guidelines.';

    // Keyword matching rules for Categories & Priority
    if (text.includes('pipe') || text.includes('water') || text.includes('burst') || text.includes('leak') || text.includes('flooding')) {
      categoryId = 3; // Water Pipe Leak
      priority = text.includes('flood') || text.includes('burst') ? 'CRITICAL' : 'HIGH';
      confidence = 94;
      explanation = 'Detected active water leakage/flooding keywords. Immediate dispatch required to prevent water loss and road damage.';
    } else if (text.includes('drain') || text.includes('clog') || text.includes('block') || text.includes('waterlog') || text.includes('sewage')) {
      categoryId = 4; // Drainage Blockage
      priority = 'HIGH';
      confidence = 91;
      explanation = 'Identified drainage blockage keywords. High priority assigned to prevent severe waterlogging and sanitation hazards.';
    } else if (text.includes('tree') || text.includes('fall') || text.includes('branch') || text.includes('storm') || text.includes('debris')) {
      categoryId = 5; // Fallen Tree / Debris
      priority = text.includes('block') || text.includes('road') ? 'HIGH' : 'MEDIUM';
      confidence = 89;
      explanation = 'Identified fallen tree/debris. Priority adjusted based on obstruction of public thoroughfares.';
    } else if (text.includes('signal') || text.includes('traffic') || text.includes('light stuck') || text.includes('red light') || text.includes('junction')) {
      categoryId = 7; // Traffic Signal Issue
      priority = 'HIGH';
      confidence = 95;
      explanation = 'Detected traffic signal malfunction at a junction. High priority assigned to prevent gridlock and traffic accidents.';
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('smell') || text.includes('bin') || text.includes('overflow')) {
      categoryId = 6; // Garbage Overflow
      priority = 'MEDIUM';
      confidence = 88;
      explanation = 'Identified sanitation/garbage overflow keywords. Scheduled for standard municipal waste collection rapid response.';
    } else if (text.includes('street light') || text.includes('streetlight') || text.includes('lamp') || text.includes('dark') || text.includes('light not working')) {
      categoryId = 2; // Streetlight Malfunction
      priority = 'LOW';
      confidence = 92;
      explanation = 'Detected streetlight malfunction. Assigned to electrical maintenance division for evening inspection.';
    } else if (text.includes('footpath') || text.includes('sidewalk') || text.includes('tile') || text.includes('walkway') || text.includes('pedestrian')) {
      categoryId = 8; // Footpath Damage
      priority = 'LOW';
      confidence = 87;
      explanation = 'Detected pedestrian footpath damage. Assigned to civil works division for localized tile replacement.';
    } else if (text.includes('pothole') || text.includes('road') || text.includes('crack') || text.includes('asphalt') || text.includes('damage')) {
      categoryId = 1; // Pothole / Road Damage
      priority = text.includes('large') || text.includes('deep') || text.includes('accident') ? 'HIGH' : 'MEDIUM';
      confidence = 90;
      explanation = 'Detected roadway surface deterioration. Priority scaled based on reported size and threat to vehicular traffic.';
    }

    // Override for extreme urgency keywords
    if (text.includes('accident') || text.includes('emergency') || text.includes('urgent') || text.includes('hazard') || text.includes('danger')) {
      if (priority !== 'CRITICAL') {
        priority = 'HIGH';
        confidence += 3;
        explanation += ' (Upgraded priority due to explicit safety hazard keywords).';
      }
    }

    return {
      categoryId,
      priority,
      confidence: Math.min(confidence, 99),
      explanation
    };
  }

  /**
   * Automatically generates professional, empathetic update notes for citizens.
   */
  async generateEngineerNote(ticketTitle, oldStatus, newStatus) {
    const title = ticketTitle || 'the reported issue';
    
    if (newStatus === 'ASSIGNED') {
      return `Update: We have officially assigned an expert municipal engineering team to investigate "${title}". A preliminary on-site evaluation will be conducted shortly. Thank you for your patience as we work to maintain our civic infrastructure.`;
    } else if (newStatus === 'IN_PROGRESS') {
      return `Update: Work is actively underway for "${title}". Our rapid-response municipal crew is currently on-site executing necessary repairs and remediation. We expect to restore full operational capability as quickly and safely as possible.`;
    } else if (newStatus === 'RESOLVED') {
      return `Resolution Notice: We are pleased to inform you that "${title}" has been successfully resolved and fully inspected by our senior engineering division. All safety and quality standards have been verified. Thank you for your vital civic engagement in keeping our community safe!`;
    } else if (newStatus === 'REJECTED') {
      return `Inspection Notice: Following a thorough evaluation of "${title}", we determined that this specific infrastructure falls outside direct municipal jurisdiction (e.g., private property or independent state highway authority). We have forwarded the details to the appropriate external governing body.`;
    } else {
      return `Status Update: The operational status for "${title}" has been updated to ${newStatus}. Our municipal engineering management is closely monitoring this ticket for timely progression.`;
    }
  }

  /**
   * AI Advisor Chat using Google Gemini with robust fallback simulation
   */
  async chatWithAI(message, history = []) {
    const systemPrompt = `You are the Chief Municipal AI Advisor and Senior Civic Engineering Expert for the Civic Portal. 
Your role is to assist citizens and municipal engineers with expert guidance, infrastructure diagnostics, reporting workflows, and civic engagement suggestions.
Key knowledge about Civic Portal:
1. Report Issue: Users can submit tickets with location, images, category (Pothole, Streetlight, Water Leak, Drainage, Fallen Tree, Traffic Signal, Garbage, Footpath), and priority. AI automatically analyzes severity.
2. Live Map & Telemetry: Real-time spatial tracking of incident radars, GPS nodes, and municipal heatmaps.
3. Community Feed & Upvotes: Citizens can upvote tickets and add comments to foster transparent community collaboration.
4. Civic Rewards & Credits: Users earn credits (e.g. +10, +20) for reporting verified issues, upvoting, and participating, unlocking badges (Civic Explorer, Sentinel, Defender, Elite Champion).
5. Government Departments & Policy: Direct communication with municipal representatives (Transportation, Water & Sanitation, Parks & Rec, Energy Bureau).
Always be highly professional, empathetic, encouraging, and clear. Format answers beautifully with clear headings, bullet points, and actionable engineering/civic advice.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const formattedHistory = history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.parts?.[0]?.text || h.text || '' }]
        }));

        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: `System Context: ${systemPrompt}\n\nI understand.` }] },
            { role: 'model', parts: [{ text: 'Greetings! I am active and ready to assist as your Chief Municipal AI Advisor.' }] },
            ...formattedHistory
          ]
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
      }
    } catch (err) {
      console.warn('Gemini API call failed or misconfigured, using expert fallback engine:', err);
    }

    // High-quality expert AI fallback engine if no API key or if network fails
    const msg = (message || '').toLowerCase();
    if (msg.includes('report') || msg.includes('ticket') || msg.includes('pothole') || msg.includes('leak') || msg.includes('submit')) {
      return `### 📋 Reporting & Rapid Triage Guide\n\nAs your Chief Municipal AI Advisor, here is how you can submit an infrastructure issue for instant AI dispatch:\n\n1. **Navigate to 'Report Issue'**: Click the button in the top navigation bar or sidebar.\n2. **Select a Preset or Custom Category**: Choose from common emergencies like *Severe Pothole Hazard*, *Main Pipe Water Leak*, *Streetlight Grid Outage*, or *Fallen Tree*.\n3. **AI Severity Triage**: As you type your title and description, our AI instantly calculates the hazard level (Low, Medium, High, Critical) and assigns it to the exact municipal department.\n4. **Attach Evidence**: Upload an image and verify your GPS coordinates on the Live Map.\n\n**💡 Expert Suggestion**: For active hazards like clean water pipe bursts or exposed wiring, include words like 'emergency' or 'safety hazard' to automatically elevate the priority flag for field engineering crews!`;
    } else if (msg.includes('reward') || msg.includes('credit') || msg.includes('badge') || msg.includes('point') || msg.includes('earn')) {
      return `### 🏆 Civic Rewards & Gamified Engagement\n\nYour active participation keeps our municipal infrastructure safe and efficient! Here is how our Civic Rewards system recognizes your contribution:\n\n* **🌟 Earning Credits**:\n  * **+20 Credits**: Reporting a verified infrastructure hazard.\n  * **+5 Credits**: Upvoting community issues in the Community Feed.\n  * **+10 Credits**: Verifying repair completion or engaging in official department chats.\n\n* **🎖️ Unlockable Tiers & Badges**:\n  * **Civic Explorer**: Your starting rank for community awareness.\n  * **Civic Sentinel** (100+ Credits): Unlocks priority ticket review.\n  * **Neighborhood Defender** (300+ Credits): Unlocks direct WhatsApp dispatch access.\n  * **Elite Civic Champion** (500+ Credits): Invited to municipal planning committees and city council advisory sessions.\n\nKeep exploring the Live Map and upvoting valid issues in your zone to level up your tier!`;
    } else if (msg.includes('map') || msg.includes('heatmap') || msg.includes('telemetry') || msg.includes('gps') || msg.includes('location')) {
      return `### 🗺️ AI Spatial Mapping & Telemetry Grid\n\nOur live mapping ecosystem provides transparent, real-time tracking of municipal operations:\n\n* **Live Incident Radars**: View pulsating markers (Red for Critical, Yellow for High, Blue for Monitored) across city sectors.\n* **Zone Telemetry**: Track active repair clusters like *Downtown Commercial Core* (Severe Concentration) or *North Residential Hills*.\n* **Field Crew Overlay**: Switch layers on the bottom of the map view to see active dispatch routes and municipal crew locations.\n\n**💡 Engineering Advice**: Use the 'Search precise address' bar in the map panel to center the telemetry grid exactly on your neighborhood block.`;
    } else if (msg.includes('department') || msg.includes('contact') || msg.includes('chat') || msg.includes('gov') || msg.includes('engineer') || msg.includes('priya') || msg.includes('rahul')) {
      return `### 🏛️ Municipal Departments & Direct Chat Nodes\n\nThe Civic Portal bridges the gap between citizens and municipal authorities through secure, direct communication:\n\n* **Key Department Nodes**:\n  * 🚏 **Department of Transportation** (Officer Davis - Transit Dispatcher)\n  * 💧 **Water & Sanitation Board** (Elena Rostova - Chief Sanitizer)\n  * 🌳 **Parks & Recreation Division** (Marcus Sterling - Landscaping Lead)\n  * ⚡ **Municipal Energy Bureau** (Thomas Chen - Microgrid Admin)\n\n* **Account Transparency**:\n  * **Citizens (e.g., Rahul Sharma)** can chat directly with assigned municipal engineers.\n  * **Engineers (e.g., Priya Patel)** receive automated AI triage summaries to coordinate field units effectively.\n\nYou can view active chat nodes and live typing telemetry directly in the **Chat** panel!`;
    } else {
      return `### 🏛️ Chief Municipal AI Advisor & Engineering Expert\n\nGreetings! I am your AI Advisor and Senior Civic Engineering Expert. I maintain full operational and telemetry oversight across the **Civic Portal**.\n\nHere are key areas where I can provide expert guidance and recommendations:\n1. 📋 **Submitting & Tracking Hazard Reports** (Potholes, Water Leaks, Streetlights, etc.)\n2. 🗺️ **Navigating the Live AI Spatial Heatmap & Telemetry Grid**\n3. 🏛️ **Communicating with Official Government Departments & Engineers**\n4. 🏆 **Earning Civic Rewards, Credits, and Community Badges**\n\n**💡 How may I collaborate with you or clarify our municipal workflows today?**`;
    }
  }
}

module.exports = new AIService();
