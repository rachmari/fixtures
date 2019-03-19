module.exports = addAndRemoveRepostioryCollaborator

const env = require('../../../lib/env')
const getTemporaryRepository = require('../../../lib/temporary-repository')

// - As user A, invite user B as collaborator to repository "hello-world"
// - As user A, list invitations
// - As user B, accept invitation
// - As user A, list collaborators (now includes user B)
// - As user A, remove user B as collaborator from repository
// - As user A, list collaborators (no longer includes user B)
async function addAndRemoveRepostioryCollaborator (state) {
  // create a temporary repository
  const temporaryRepository = getTemporaryRepository({
    request: state.request,
    token: env.FIXTURES_USER_A_TOKEN_FULL_ACCESS_GHE,
    org: env.FIXTURES_ORGANIZATION,
    name: 'add-and-remove-repository-collaborator'
  })

  await temporaryRepository.create()

  // https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
  await state.request({
    method: 'put',
    url: `/repos/${env.FIXTURES_ORGANIZATION}/${temporaryRepository.name}/collaborators/${env.FIXTURES_USER_B}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS_GHE}`
    }
  })

  // https://developer.github.com/v3/repos/invitations/
  const invitationsResponse = await state.request({
    method: 'get',
    url: `/repos/${env.FIXTURES_ORGANIZATION}/${temporaryRepository.name}/invitations`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS_GHE}`
    }
  })

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  await state.request({
    method: 'get',
    url: `/repos/${env.FIXTURES_ORGANIZATION}/${temporaryRepository.name}/collaborators`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS_GHE}`
    }
  })

  // https://developer.github.com/v3/repos/collaborators/#remove-user-as-a-collaborator
  await state.request({
    method: 'delete',
    url: `/repos/${env.FIXTURES_ORGANIZATION}/${temporaryRepository.name}/collaborators/${env.FIXTURES_USER_B}`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS_GHE}`
    }
  })

  // https://developer.github.com/v3/repos/collaborators/#list-collaborators
  await state.request({
    method: 'get',
    url: `/repos/${env.FIXTURES_ORGANIZATION}/${temporaryRepository.name}/collaborators`,
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${env.FIXTURES_USER_A_TOKEN_FULL_ACCESS_GHE}`
    }
  })

  await temporaryRepository.delete()
}
