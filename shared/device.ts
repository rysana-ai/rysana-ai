export type DevicePlatform =
  | 'android'
  | 'ios'
  | 'linux'
  | 'mac'
  | 'unknown'
  | 'windows'

export function getDevicePlatform(): DevicePlatform {
  if (typeof window !== 'undefined' && 'userAgentData' in navigator) {
    const userAgentData = navigator.userAgentData as {
      platform: string
    }

    const platform = userAgentData.platform.toLowerCase()

    switch (true) {
      case platform.includes('android'):
        return 'android'
      case platform.includes('ios'):
        return 'ios'
      case platform.includes('linux'):
        return 'linux'
      case platform.includes('mac'):
        return 'mac'
      case platform.includes('windows'):
        return 'windows'
    }
  }

  return 'unknown'
}
