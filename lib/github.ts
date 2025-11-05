import { Octokit } from '@octokit/rest'

export interface DeveloperMetrics {
  developer: string
  commits: number
  pullRequests: number
  linesAdded: number
  linesDeleted: number
  reviewComments: number
  impactScore: number
}

export async function fetchMetrics(
  octokit: Octokit,
  owner: string,
  repos: string[]
): Promise<DeveloperMetrics[]> {
  const developerMap = new Map<string, DeveloperMetrics>()

  for (const repo of repos) {
    try {
      // Fetch commits
      const commits = await octokit.paginate(octokit.repos.listCommits, {
        owner,
        repo,
        per_page: 100,
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      })

      for (const commit of commits) {
        const author = commit.author?.login || commit.commit.author?.name || 'Unknown'

        if (!developerMap.has(author)) {
          developerMap.set(author, {
            developer: author,
            commits: 0,
            pullRequests: 0,
            linesAdded: 0,
            linesDeleted: 0,
            reviewComments: 0,
            impactScore: 0,
          })
        }

        const metrics = developerMap.get(author)!
        metrics.commits++

        // Fetch commit details for line changes
        try {
          const commitDetail = await octokit.repos.getCommit({
            owner,
            repo,
            ref: commit.sha,
          })

          metrics.linesAdded += commitDetail.data.stats?.additions || 0
          metrics.linesDeleted += commitDetail.data.stats?.deletions || 0
        } catch (err) {
          // Skip if commit details can't be fetched
        }
      }

      // Fetch pull requests
      const pullRequests = await octokit.paginate(octokit.pulls.list, {
        owner,
        repo,
        state: 'all',
        per_page: 100,
        sort: 'updated',
        direction: 'desc',
      })

      for (const pr of pullRequests) {
        const author = pr.user?.login || 'Unknown'

        if (!developerMap.has(author)) {
          developerMap.set(author, {
            developer: author,
            commits: 0,
            pullRequests: 0,
            linesAdded: 0,
            linesDeleted: 0,
            reviewComments: 0,
            impactScore: 0,
          })
        }

        const metrics = developerMap.get(author)!
        metrics.pullRequests++
      }

      // Fetch review comments
      try {
        const comments = await octokit.paginate(octokit.pulls.listReviewCommentsForRepo, {
          owner,
          repo,
          per_page: 100,
          since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

        for (const comment of comments) {
          const author = comment.user?.login || 'Unknown'

          if (!developerMap.has(author)) {
            developerMap.set(author, {
              developer: author,
              commits: 0,
              pullRequests: 0,
              linesAdded: 0,
              linesDeleted: 0,
              reviewComments: 0,
              impactScore: 0,
            })
          }

          const metrics = developerMap.get(author)!
          metrics.reviewComments++
        }
      } catch (err) {
        // Skip if comments can't be fetched
      }
    } catch (error) {
      console.error(`Error fetching data for ${repo}:`, error)
    }
  }

  // Calculate impact scores
  const metricsArray = Array.from(developerMap.values())

  metricsArray.forEach(metrics => {
    // Impact score formula: weighted average of normalized metrics
    const maxCommits = Math.max(...metricsArray.map(m => m.commits), 1)
    const maxPRs = Math.max(...metricsArray.map(m => m.pullRequests), 1)
    const maxLines = Math.max(...metricsArray.map(m => m.linesAdded + m.linesDeleted), 1)
    const maxComments = Math.max(...metricsArray.map(m => m.reviewComments), 1)

    const commitScore = (metrics.commits / maxCommits) * 25
    const prScore = (metrics.pullRequests / maxPRs) * 30
    const lineScore = ((metrics.linesAdded + metrics.linesDeleted) / maxLines) * 30
    const commentScore = (metrics.reviewComments / maxComments) * 15

    metrics.impactScore = Math.round(commitScore + prScore + lineScore + commentScore)
  })

  return metricsArray.sort((a, b) => b.impactScore - a.impactScore)
}
