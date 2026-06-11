import prisma from '../config/prisma.js';

export const getProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.prismaId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.prismaId },
      include: { profile: true }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
        ...user.profile,
        role: user.role
    });
  } catch (err) {
    next(err);
  }
};

export const getActivities = async (req, res, next) => {
  try {
    if (!req.user || !req.user.prismaId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const events = await prisma.analyticsEvent.findMany({
      where: { userId: req.user.prismaId },
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    const activities = events.map(event => ({
      createdAt: event.createdAt,
      actionType: event.eventType,
      details: event.metadata || { topic: event.eventCategory }
    }));

    res.json(activities);
  } catch (err) {
    next(err);
  }
};

export const getSavedTerms = async (req, res, next) => {
  try {
    if (!req.user || !req.user.prismaId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch the 4 most recent distinct search terms for this user
    const recentSearches = await prisma.searchLog.findMany({
      where: { userId: req.user.prismaId },
      orderBy: { createdAt: 'desc' },
      distinct: ['searchTerm'],
      take: 4
    });

    const recentTerms = recentSearches.map(search => ({
      term: search.searchTerm,
      definition: search.searchCategory || 'Recently searched term',
      createdAt: search.createdAt
    }));

    res.json(recentTerms);
  } catch (err) {
    next(err);
  }
};
