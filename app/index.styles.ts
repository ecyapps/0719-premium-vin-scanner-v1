// VINScanner.styles.ts
import { theme } from '@/theme/theme';

export const styles = {
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },

  vinModalOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 1000,
    paddingHorizontal: 20,
  },

  // Base Modal
  vinModal: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    alignItems: 'center' as const,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  vinModalPortrait: {
    width: '92%' as const,
    maxWidth: 440,
    maxHeight: '80%' as const,
    padding: 28,
    paddingBottom: 32,
  },
  vinModalLandscape: {
    width: '65%' as const,
    maxWidth: 480,
    maxHeight: '90%' as const,
    paddingHorizontal: 32,
    paddingVertical: 24,
    paddingBottom: 32,
  },

  vinCloseButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.gray[200],
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 10,
  },
  vinCloseText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.gray[600],
  },

  vinTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.black,
    marginBottom: 28,
    marginTop: 8,
    textAlign: 'center' as const,
    letterSpacing: 0.5,
  },

  vinCodeContainer: {
    width: '100%' as const,
    marginBottom: 40,
  },
  vinCodeLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: theme.colors.gray[500],
    textAlign: 'center' as const,
    marginBottom: 14,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  vinCodeBox: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    minHeight: 80,
    justifyContent: 'center' as const,
    width: '100%' as const,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vinCode: {
    fontWeight: '900' as const,
    color: theme.colors.black,
    textAlign: 'center' as const,
    letterSpacing: 1.8,
    fontFamily: 'monospace' as const,
    flexShrink: 1,
  },
  vinCodePortrait: {
    fontSize: 16,
    lineHeight: 22,
  },
  vinCodeLandscape: {
    fontSize: 22,
    lineHeight: 28,
  },

  vinButtons: {
    width: '100%' as const,
    marginTop: 8,
  },
  vinButtonsPortrait: {
    flexDirection: 'column' as const,
    gap: 16,
    paddingBottom: 4,
  },
  vinButtonsLandscape: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 20,
    paddingBottom: 4,
  },

  vinButton: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 14,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 58,
  },
  vinButtonPrimary: {
    backgroundColor: theme.colors.black,
  },
  vinButtonSecondary: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  vinButtonTextPrimary: {
    color: theme.colors.white,
    fontSize: 17,
    fontWeight: 'bold' as const,
    letterSpacing: 0.3,
  },
  vinButtonTextSecondary: {
    color: theme.colors.gray[700],
    fontSize: 17,
    fontWeight: 'bold' as const,
    letterSpacing: 0.3,
  },
};