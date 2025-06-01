import { abountUsSchema } from '../app/modules/aboutUsModule/aboutUs.model';
import { faqSchema } from '../app/modules/faqModule/faq.model';
import { privacyPolicySchema } from '../app/modules/privacyPolicyModule/privacyPolicy.model';
import { termsConditionSchema } from '../app/modules/termsConditionModule/termsCondition.model';
import { userSchema } from '../app/modules/userModule/user.model';
import schemaConverter from '../utils/schemaConverter';

export const swaggerTags = [
  {
    name: 'User',
    description: 'User APIs',
  },
  {
    name: 'About Us',
    description: 'About Us APIs',
  },
  {
    name: 'Terms Condition',
    description: 'Terms Condition APIs',
  },
  {
    name: 'Privacy Policy',
    description: 'Privacy Policy APIs',
  },
  {
    name: 'FAQ',
    description: 'FAQ APIs',
  }
];

export const swaggerDefinition = {
  UserSchema: schemaConverter(userSchema, ['isEmailVerified', 'verification.code', 'verification.expireDate', 'role', 'status', 'createdAt', 'updatedAt']),
  AboutUsSchema: schemaConverter(abountUsSchema, ['createdAt', 'updatedAt']),
  TermsConditionSchema: schemaConverter(termsConditionSchema, ['createdAt', 'updatedAt']),
  PrivacyPolicySchema: schemaConverter(privacyPolicySchema, ['createdAt', 'updatedAt']),
  FAQSchema: schemaConverter(faqSchema, ['createdAt', 'updatedAt']),
};
