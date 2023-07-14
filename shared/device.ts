export function getDevicePlatform() {
  if (typeof window !== 'undefined' && 'userAgentData' in navigator) {
    const userAgentData = navigator.userAgentData as {
      platform: string
    }

    const platform = userAgentData.platform.toLowerCase()

    if (platform.includes('android')) return 'android'
    if (platform.includes('ios')) return 'ios'
    if (platform.includes('linux')) return 'linux'
    if (platform.includes('mac')) return 'mac'
    if (platform.includes('windows')) return 'windows'
  }

  return 'unknown'
}

export type DevicePlatform = ReturnType<typeof getDevicePlatform>
