/**
 * @component StyleGuide
 * @description Comprehensive style guide showcasing the centralized design system
 * @props StyleGuideProps - Configuration for the style guide
 * @returns Rendered style guide with all design tokens and components
 */

import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { designSystem, textStyles, layoutStyles, containerStyles, createStyles } from '../../theme';
import { Card, Button, Badge } from './index';

export interface StyleGuideProps {
  /** Show color palette */
  showColors?: boolean;
  /** Show typography scale */
  showTypography?: boolean;
  /** Show spacing scale */
  showSpacing?: boolean;
  /** Show component examples */
  showComponents?: boolean;
}

export const StyleGuide: React.FC<StyleGuideProps> = ({
  showColors = true,
  showTypography = true,
  showSpacing = true,
  showComponents = true,
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={textStyles.h1}>Design System</Text>
        <Text style={textStyles.subtitle}>Premium VIN Scanner App</Text>
      </View>

      {showColors && (
        <View style={styles.section}>
          <Text style={textStyles.h2}>Color Palette</Text>
          
          {/* Primary Colors */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Primary Colors</Text>
            <View style={layoutStyles.row}>
              <ColorSwatch color={designSystem.colors.primary} name="Primary" />
              <ColorSwatch color={designSystem.colors.primaryDark} name="Primary Dark" />
              <ColorSwatch color={designSystem.colors.secondary} name="Secondary" />
            </View>
          </View>

          {/* Semantic Colors */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Semantic Colors</Text>
            <View style={layoutStyles.row}>
              <ColorSwatch color={designSystem.colors.success} name="Success" />
              <ColorSwatch color={designSystem.colors.warning} name="Warning" />
              <ColorSwatch color={designSystem.colors.error} name="Error" />
              <ColorSwatch color={designSystem.colors.info} name="Info" />
            </View>
          </View>

          {/* Gray Scale */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Gray Scale</Text>
            <View style={layoutStyles.row}>
              <ColorSwatch color={designSystem.colors.gray[50]} name="Gray 50" />
              <ColorSwatch color={designSystem.colors.gray[200]} name="Gray 200" />
              <ColorSwatch color={designSystem.colors.gray[500]} name="Gray 500" />
              <ColorSwatch color={designSystem.colors.gray[900]} name="Gray 900" />
            </View>
          </View>
        </View>
      )}

      {showTypography && (
        <View style={styles.section}>
          <Text style={textStyles.h2}>Typography Scale</Text>
          
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Headings</Text>
            <Text style={textStyles.h1}>Heading 1 - {designSystem.typography.fontSize['4xl']}px</Text>
            <Text style={textStyles.h2}>Heading 2 - {designSystem.typography.fontSize['3xl']}px</Text>
            <Text style={textStyles.h3}>Heading 3 - {designSystem.typography.fontSize.xl}px</Text>
            <Text style={textStyles.h4}>Heading 4 - {designSystem.typography.fontSize.lg}px</Text>
          </View>

          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Body Text</Text>
            <Text style={textStyles.bodyLarge}>Large body text - {designSystem.typography.fontSize.md}px</Text>
            <Text style={textStyles.body}>Regular body text - {designSystem.typography.fontSize.base}px</Text>
            <Text style={textStyles.bodySmall}>Small body text - {designSystem.typography.fontSize.sm}px</Text>
            <Text style={textStyles.caption}>Caption text - {designSystem.typography.fontSize.xs}px</Text>
          </View>

          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Special Text</Text>
            <Text style={textStyles.label}>Label Text</Text>
            <Text style={textStyles.link}>Link Text</Text>
            <Text style={textStyles.vin}>VIN: 1HGBH41JXMN109186</Text>
            <Text style={textStyles.success}>Success Message</Text>
            <Text style={textStyles.error}>Error Message</Text>
            <Text style={textStyles.warning}>Warning Message</Text>
          </View>
        </View>
      )}

      {showSpacing && (
        <View style={styles.section}>
          <Text style={textStyles.h2}>Spacing Scale</Text>
          
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Spacing Values</Text>
            <SpacingExample size={designSystem.spacing.xs} name="XS (4px)" />
            <SpacingExample size={designSystem.spacing.sm} name="SM (8px)" />
            <SpacingExample size={designSystem.spacing.md} name="MD (16px)" />
            <SpacingExample size={designSystem.spacing.lg} name="LG (24px)" />
            <SpacingExample size={designSystem.spacing.xl} name="XL (32px)" />
            <SpacingExample size={designSystem.spacing['2xl']} name="2XL (40px)" />
          </View>
        </View>
      )}

      {showComponents && (
        <View style={styles.section}>
          <Text style={textStyles.h2}>Component Examples</Text>
          
          {/* Cards */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Cards</Text>
            
            <Card variant="stat" size="medium">
              <Text style={textStyles.label}>Stat Card</Text>
              <Text style={textStyles.h1}>$2,400</Text>
              <Text style={textStyles.caption}>Average Savings</Text>
            </Card>

            <Card variant="insight" size="medium">
              <Text style={textStyles.h4}>Market Insight</Text>
              <Text style={textStyles.body}>This vehicle is priced 15% above market average for similar models in your area.</Text>
            </Card>

            <Card variant="action" size="medium">
              <Text style={textStyles.label}>Next Steps</Text>
              <Text style={textStyles.body}>Review the negotiation guide to maximize your savings.</Text>
            </Card>
          </View>

          {/* Buttons */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Buttons</Text>
            
            <View style={styles.buttonGroup}>
              <Button variant="primary" title="Primary Button" onPress={() => {}} />
              <Button variant="secondary" title="Secondary Button" onPress={() => {}} />
              <Button variant="action" title="Action Button" onPress={() => {}} />
            </View>

            <View style={styles.buttonGroup}>
              <Button variant="primary" size="small" title="Small" onPress={() => {}} />
              <Button variant="primary" size="medium" title="Medium" onPress={() => {}} />
              <Button variant="primary" size="large" title="Large" onPress={() => {}} />
            </View>
          </View>

          {/* Badges */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Badges</Text>
            
            <View style={layoutStyles.badgeRow}>
              <Badge variant="success" text="Success" />
              <Badge variant="warning" text="Warning" />
              <Badge variant="error" text="Error" />
              <Badge variant="info" text="Info" />
            </View>

            <View style={layoutStyles.badgeRow}>
              <Badge variant="savings" text="$1,200 Saved" />
              <Badge variant="time" text="2 days ago" />
              <Badge variant="status" />
              <Badge variant="dot" />
            </View>
          </View>

          {/* Layout Examples */}
          <View style={styles.subsection}>
            <Text style={textStyles.h4}>Layout Patterns</Text>
            
            <Card variant="default" size="medium">
              <View style={layoutStyles.rowSpaceBetween}>
                <Text style={textStyles.label}>Dealer Price</Text>
                <Text style={textStyles.error}>$28,500</Text>
              </View>
              
              <View style={layoutStyles.rowSpaceBetween}>
                <Text style={textStyles.label}>Market Price</Text>
                <Text style={textStyles.success}>$26,100</Text>
              </View>
              
              <View style={layoutStyles.rowSpaceBetween}>
                <Text style={textStyles.label}>Your Target</Text>
                <Text style={[textStyles.label, { color: designSystem.colors.primary }]}>$25,000</Text>
              </View>
            </Card>
          </View>
        </View>
      )}

      {/* Design System Validation */}
      <View style={styles.section}>
        <Text style={textStyles.h2}>System Validation</Text>
        
        <Card variant="insight" size="medium">
          <Text style={textStyles.h4}>✅ Design System Active</Text>
          <Text style={textStyles.body}>
            All components are using the centralized design system with consistent:
          </Text>
          <View style={styles.validationList}>
            <Text style={textStyles.bodySmall}>• Color tokens from theme.colors</Text>
            <Text style={textStyles.bodySmall}>• Typography from theme.typography</Text>
            <Text style={textStyles.bodySmall}>• Spacing from theme.spacing</Text>
            <Text style={textStyles.bodySmall}>• Shadows from theme.shadows</Text>
            <Text style={textStyles.bodySmall}>• Component variants and sizes</Text>
          </View>
        </Card>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

// Helper Components
const ColorSwatch: React.FC<{ color: string; name: string }> = ({ color, name }) => (
  <View style={styles.colorSwatch}>
    <View style={[styles.colorBox, { backgroundColor: color }]} />
    <Text style={textStyles.caption}>{name}</Text>
    <Text style={[textStyles.caption, { fontFamily: 'monospace' }]}>{color}</Text>
  </View>
);

const SpacingExample: React.FC<{ size: number; name: string }> = ({ size, name }) => (
  <View style={styles.spacingExample}>
    <View style={[styles.spacingBox, { width: size, height: 20 }]} />
    <Text style={textStyles.bodySmall}>{name}</Text>
  </View>
);

// Styles using the design system
const styles = createStyles({
  container: {
    ...containerStyles.screen,
    padding: designSystem.spacing.lg,
  },
  
  header: {
    ...containerStyles.content,
    alignItems: 'center' as const,
    marginBottom: designSystem.spacing['2xl'],
  },
  
  section: {
    marginBottom: designSystem.spacing['3xl'],
  },
  
  subsection: {
    marginBottom: designSystem.spacing.xl,
  },
  
  buttonGroup: {
    ...layoutStyles.row,
    gap: designSystem.spacing.md,
    marginBottom: designSystem.spacing.md,
    flexWrap: 'wrap' as const,
  },
  
  colorSwatch: {
    alignItems: 'center' as const,
    marginRight: designSystem.spacing.lg,
    marginBottom: designSystem.spacing.md,
  },
  
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: designSystem.borderRadius.base,
    marginBottom: designSystem.spacing.xs,
    borderWidth: 1,
    borderColor: designSystem.colors.gray[200],
  },
  
  spacingExample: {
    ...layoutStyles.row,
    alignItems: 'center' as const,
    marginBottom: designSystem.spacing.sm,
  },
  
  spacingBox: {
    backgroundColor: designSystem.colors.primary,
    marginRight: designSystem.spacing.md,
    borderRadius: designSystem.borderRadius.sm,
  },
  
  validationList: {
    marginTop: designSystem.spacing.md,
    paddingLeft: designSystem.spacing.sm,
  },
  
  spacer: {
    height: designSystem.spacing['4xl'],
  },
});

export default StyleGuide; 