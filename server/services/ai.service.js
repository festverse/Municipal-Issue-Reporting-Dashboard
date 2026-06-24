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
}

module.exports = new AIService();
