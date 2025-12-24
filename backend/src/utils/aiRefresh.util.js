function shouldReanalyze(profile, newQuestionsCount) {
    if (!profile) return true;

    const days =
        (Date.now() - new Date(profile.last_analyzed_at)) / (1000 * 60 * 60 * 24);

    if (days >= 14) return true;
    if (newQuestionsCount >= 10) return true;

    return false;
}

module.exports = { shouldReanalyze };